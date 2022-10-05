import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CSVLink } from "react-csv";
import { InterviewerCallHistoryReport } from "../../interfaces";
import { getInterviewerCallHistoryReport } from "../../utilities/HTTP";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import { formatDateAndTime } from "../../utilities/DateFormatter";
import FilterSummary from "../../components/FilterSummary";
import CallHistoryReportTable from "../../components/CallHistoryReportTable";
import { ONSPanel, ONSLoadingPanel } from "blaise-design-system-react-components";

interface RenderInterviewerCallHistoryReportPageProps {
    interviewer: string;
    startDate: Date;
    endDate: Date;
    surveyTla: string;
    questionnaires: string[];
    navigateBack: () => void;
    navigateBackTwoSteps: () => void;
}

type ReportState = "loading" | "loaded" | "failed"

function RenderInterviewerCallHistoryReport(props: RenderInterviewerCallHistoryReportPageProps): ReactElement {
    const [reportData, setReportData] = useState<InterviewerCallHistoryReport[]>([]);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [reportState, setReportState] = useState<ReportState>("loading");
    const {
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
        runInterviewerCallHistoryReport().catch(() => setReportState("failed"));
    }, []);

    async function runInterviewerCallHistoryReport(): Promise<void> {
        const formValues: Record<string, any> = {};
        setReportData([]);
        setInterviewerID(props.interviewer);
        formValues.survey_tla = props.surveyTla;
        formValues.interviewer = props.interviewer;
        formValues.start_date = props.startDate;
        formValues.end_date = props.endDate;
        formValues.questionnaires = props.questionnaires;

        const callHistory = await getInterviewerCallHistoryReport(formValues);
        setReportData(callHistory);
        console.log(callHistory);
        setReportState("loaded");
    }

    function report(): ReactNode {
        switch (reportState) {

        case "loaded":
            return (
                <CallHistoryReportTable
                    messageNoData="No data found for parameters given."
                    reportData={ reportData }/>
            );
        case "failed":
            return (
                <ONSPanel status="error">
                    <p>Failed to load</p>
                </ONSPanel>
            );
        default:
            return <ONSLoadingPanel/>;
        }
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={ [{ link: "/", title: "Reports" }, {
                link: "#",
                onClickFunction: navigateBackTwoSteps,
                title: "Interviewer details"
            }, { link: "#", onClickFunction: navigateBack, title: "Questionnaires" }] }/>
            <main id="main-content" className="page__main u-mt-s">
                <h1>Call History Report</h1>
                <FilterSummary { ...props }/>
                <CallHistoryLastUpdatedStatus/>
                <br/>
                <CSVLink
                    hidden={ reportData === null || reportData.length === 0 }
                    data={
                        reportData?.map(row => (
                            { ...row, call_start_time: formatDateAndTime(row.call_start_time) }
                        ))
                    }
                    headers={ reportExportHeaders }
                    target="_blank"
                    filename={ `interviewer-call-history-${ interviewerID }.csv` }>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>
                { report() }
            </main>
        </>
    );
}

export default RenderInterviewerCallHistoryReport;
