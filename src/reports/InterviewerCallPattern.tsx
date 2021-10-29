import React, {ReactElement, useState} from "react";
import {ErrorBoundary, ONSPanel} from "blaise-design-system-react-components";
import {getInterviewerCallPatternReport} from "../utilities/HTTP";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {CSVLink} from "react-csv";
import {formatText} from "../utilities/TextFormatting";
import Breadcrumbs from "../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../components/CallHistoryLastUpdatedStatus";
import SurveyInterviewerStartDateEndDateForm from "../components/SurveyInterviewerStartDateEndDateForm";
import ReportErrorPanel from "../components/ReportErrorPanel";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function InterviewerCallPattern(): ReactElement {
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<any>({});
    const [reportFailed, setReportFailed] = useState<boolean>(false);


    async function runInterviewerCallPatternReport(formValues: any, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        setMessageNoData("");
        setReportFailed(false);
        setReportData([]);
        setInterviewerID(formValues["Interviewer ID"]);
        formValues.survey_tla = formValues["Survey TLA"];
        formValues.interviewer = formValues["Interviewer ID"];
        formValues.start_date = new Date(formValues["Start date"]);
        formValues.end_date = new Date(formValues["End date"]);

        const [success, data] = await getInterviewerCallPatternReport(formValues);
        setSubmitting(false);

        if (!success) {
            setReportFailed(true);
            return;
        }

        if (Object.keys(data).length === 0) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        console.log(data);
        setReportData(data);
    }

    function convertJsonToTable(object: any) {
        const elementList: ReactElement[] = [];
        const entries: [string, (string | null | number)][] = Object.entries(object);
        for (const [field, data] of entries) {
            elementList.push(
                <tbody className="summary__item" key={field}>
                <tr className="summary__row summary__row--has-values">
                    <td className="summary__item-title">
                        <div className="summary__item--text">
                            {formatText(field)}
                        </div>
                    </td>
                    <td className="summary__values" colSpan={2}>
                        {data}
                    </td>
                </tr>
                </tbody>
            );
        }
        return elementList.map((element => {
            return element;
        }));
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{link: "/", title: "Back"}]}/>
            <main id="main-content" className="page__main u-mt-s">
                <h1 className="u-mb-m">Run interviewer call pattern report</h1>
                <ReportErrorPanel error={reportFailed}/>
                <CallHistoryLastUpdatedStatus/>
                <div className="u-mb-m">
                    <ONSPanel>
                        <p>
                            Incomplete data is removed from this report. This will impact the accuracy of the report.
                        </p>
                        <p>
                            The <b>Discounted invalid records</b> entry will advise how many records have been removed.
                        </p>
                        <p>
                            The <b>Invalid fields</b> entry will advise which fields were incomplete.
                        </p>
                    </ONSPanel>
                </div>
                <SurveyInterviewerStartDateEndDateForm onSubmitFunction={runInterviewerCallPatternReport}/>
                <br/>
                <CSVLink hidden={Object.entries(reportData).length === 0}
                         data={[reportData]}
                         target="_blank"
                         filename={`interviewer-call-pattern-${interviewerID}.csv`}>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>
                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        Object.entries(reportData).length > 0
                            ?
                            <div className="summary">
                                <div className="summary__group">
                                    <table id="report-table" className="summary__items u-mt-s">
                                        {
                                            convertJsonToTable(reportData)
                                        }
                                    </table>
                                </div>
                            </div>
                            :
                            <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                    }
                    <br/>
                </ErrorBoundary>
            </main>
        </>
    );
}

export default InterviewerCallPattern;
