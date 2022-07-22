import React, { ReactElement, useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CSVLink } from "react-csv";
import { ErrorBoundary, ONSPanel } from "blaise-design-system-react-components";
import { InterviewerCallHistoryReport } from "../../interfaces";
import { convertSecondsToMinutesAndSeconds } from "../../utilities/Converters";
import { getInterviewerCallHistoryReport } from "../../utilities/HTTP";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import { formatDate, formatDateAndTime } from "../../utilities/DateFormatter";

interface RenderInterviewerCallHistoryReportPageProps {
    interviewer: string
    startDate: Date
    endDate: Date
    surveyTla: string
    questionnaires: string[]
    navigateBack: () => void
    navigateBackTwoSteps: () => void
}

function formatList(listOfQuestionnaires: string[]): string {
    if (listOfQuestionnaires.length === 1) return listOfQuestionnaires[0];
    const firsts = listOfQuestionnaires.slice(0, listOfQuestionnaires.length - 1);
    const last = listOfQuestionnaires[listOfQuestionnaires.length - 1];
    return firsts.join(", ") + " and " + last;
}

function RenderInterviewerCallHistoryReport(props: RenderInterviewerCallHistoryReportPageProps): ReactElement {
    const [reportData, setReportData] = useState<InterviewerCallHistoryReport[]>([]);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const {
        interviewer,
        startDate,
        endDate,
        questionnaires,
        navigateBack,
        navigateBackTwoSteps,
    } = props;

    const reportExportHeaders = [
        { label: "Interviewer", key: "interviewer" },
        { label: "Questionnaire", key: "questionnaire_name" },
        { label: "Serial Number", key: "serial_number" },
        { label: "Call Start Time", key: "call_start_time" },
        { label: "Call Length (Seconds)", key: "dial_secs" },
        { label: "Call Result", key: "call_result" }
    ];

    useEffect(() => {
        runInterviewerCallHistoryReport();
    }, []
    );

    async function runInterviewerCallHistoryReport(): Promise<void> {
        const formValues: Record<string, any> = {};
        setMessageNoData("");
        setReportData([]);
        setInterviewerID(props.interviewer);
        formValues.survey_tla = props.surveyTla;
        formValues.interviewer = props.interviewer;
        formValues.start_date = props.startDate;
        formValues.end_date = props.endDate;
        formValues.questionnaires = props.questionnaires;

        let callHistory: InterviewerCallHistoryReport[];
        try {
            callHistory = await getInterviewerCallHistoryReport(formValues);
        } catch {
            //setReportFailed(true);
            return;
        } finally {
            //setSubmitting(false);
        }

        if (callHistory.length === 0) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        console.log(callHistory);
        setReportData(callHistory);

    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{ link: "/", title: "Reports" }, {
                link: "#",
                onClickFunction: navigateBackTwoSteps,
                title: "Interviewer details"
            }, { link: "#", onClickFunction: navigateBack, title: "Questionnaires" }]}/>
            <main id="main-content" className="page__main u-mt-s">
                <h1>Call History Report</h1>
                <h3 className="u-mb-m">
                    Interviewer: {interviewer} <br></br>
                    Period: {formatDate(startDate)}–{formatDate(endDate)}<br></br>
                    Questionnaire{questionnaires.length > 1 ? ("s") : ""}: {formatList(questionnaires)}
                </h3>
                <CallHistoryLastUpdatedStatus/>

                <div>

                </div>

                <br/>
                <CSVLink hidden={reportData === null || reportData.length === 0}
                    data={
                        reportData?.map(row => (
                            { ...row, call_start_time: formatDateAndTime(row.call_start_time) }
                        ))
                    }
                    headers={reportExportHeaders}
                    target="_blank"
                    filename={`interviewer-call-history-${interviewerID}.csv`}>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>

                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        reportData && reportData.length > 0
                            ?
                            <table id="report-table" className="table u-mt-s">
                                <thead className="table__head u-mt-m">
                                    <tr className="table__row">
                                        <th scope="col" className="table__header ">
                                            <span>Questionnaire</span>
                                        </th>
                                        <th scope="col" className="table__header ">
                                            <span>Serial Number</span>
                                        </th>
                                        <th scope="col" className="table__header ">
                                            <span>Call Start Time</span>
                                        </th>
                                        <th scope="col" className="table__header ">
                                            <span>Call Length</span>
                                        </th>
                                        <th scope="col" className="table__header ">
                                            <span>Call Result</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table__body">
                                    {
                                        reportData.map((callHistory: InterviewerCallHistoryReport) => {
                                            return (
                                                <tr className="table__row" key={callHistory.call_start_time}
                                                    data-testid={"report-table-row"}>
                                                    <td className="table__cell ">
                                                        {callHistory.questionnaire_name}
                                                    </td>
                                                    <td className="table__cell ">
                                                        {callHistory.serial_number}
                                                    </td>
                                                    <td className="table__cell ">
                                                        {formatDateAndTime(callHistory.call_start_time)}
                                                    </td>
                                                    <td className="table__cell ">
                                                        {convertSecondsToMinutesAndSeconds(callHistory.dial_secs)}
                                                    </td>
                                                    <td className="table__cell ">
                                                        {(callHistory.call_result === null ? "Unknown" : callHistory.call_result)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            :
                            <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                    }
                    <br/>
                </ErrorBoundary>
            </main>
        </>
    );
}

export default RenderInterviewerCallHistoryReport;
