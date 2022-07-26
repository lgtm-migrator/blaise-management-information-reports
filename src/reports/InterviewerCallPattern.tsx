import React, { ReactElement, useState } from "react";
import { ErrorBoundary, ONSPanel, SummaryGroupTable, GroupedSummary, Group } from "blaise-design-system-react-components";
import { getInterviewerCallPatternReport } from "../utilities/HTTP";
import { CSVLink } from "react-csv";
import Breadcrumbs from "../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../components/CallHistoryLastUpdatedStatus";
import SurveyInterviewerStartDateEndDateForm from "../components/SurveyInterviewerStartDateEndDateForm";
import ReportErrorPanel from "../components/ReportErrorPanel";
import { InterviewerCallPatternReport } from "../interfaces";

function formatToFractionAndPercentage(numerator: number | undefined, denominator: number | undefined): string {
    if (!numerator) {
        numerator = 0;
    }
    if (denominator === 0 || denominator === undefined) {
        console.warn("Cannot divide by 0");
        return "0/0, 0%";
    }
    return `${numerator}/${denominator}, ${(numerator / denominator * 100).toFixed(2)}%`;
}

function callTimeSection(callPatternReport: InterviewerCallPatternReport): Group {
    return {
        title: "Call times",
        records: {
            hours_worked: callPatternReport.hours_worked,
            call_time: callPatternReport.call_time,
            hours_on_calls_percentage: `${(callPatternReport.hours_on_calls_percentage || 0).toFixed(2)}%`,
            average_calls_per_hour: callPatternReport.average_calls_per_hour
        }
    };
}

function callStatusSection(callPatternReport: InterviewerCallPatternReport): Group {
    return {
        title: "Call status",
        records: {
            refusals: formatToFractionAndPercentage(callPatternReport.refusals, callPatternReport.total_valid_cases),
            completed_successfully: formatToFractionAndPercentage(callPatternReport.completed_successfully, callPatternReport.total_valid_cases),
            appointments_for_contacts: formatToFractionAndPercentage(callPatternReport.appointments_for_contacts, callPatternReport.total_valid_cases),
            web_nudge: formatToFractionAndPercentage(callPatternReport.web_nudge, callPatternReport.total_valid_cases),
            no_contacts: formatToFractionAndPercentage(callPatternReport.no_contacts, callPatternReport.total_valid_cases),
            discounted_invalid_cases: formatToFractionAndPercentage(callPatternReport.discounted_invalid_cases, callPatternReport.total_records),
        }
    };
}

function noContactBreakdownSection(callPatternReport: InterviewerCallPatternReport): Group {
    return {
        title: "Breakdown of No Contact calls",
        records: {
            answer_service: formatToFractionAndPercentage(callPatternReport.no_contact_answer_service, callPatternReport.no_contacts),
            busy: formatToFractionAndPercentage(callPatternReport.no_contact_busy, callPatternReport.no_contacts),
            disconnect: formatToFractionAndPercentage(callPatternReport.no_contact_disconnect, callPatternReport.no_contacts),
            no_answer: formatToFractionAndPercentage(callPatternReport.no_contact_no_answer, callPatternReport.no_contacts),
            other: formatToFractionAndPercentage(callPatternReport.no_contact_other, callPatternReport.no_contacts),
        }
    };
}

function invalidFieldsGroup(callPatternReport: InterviewerCallPatternReport): Group {
    return {
        title: "Invalid Fields",
        records: {
            invalid_fields: callPatternReport.invalid_fields,
            discounted_invalid_cases: callPatternReport.discounted_invalid_cases,
            total_records: callPatternReport.total_records
        }
    };
}

function isAllInvalid(callPatternReport: InterviewerCallPatternReport): boolean {
    return !callPatternReport.total_valid_cases;
}

function InterviewerCallPattern(): ReactElement {
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [groupedSummary, setGroupedSummary] = useState<GroupedSummary>(new GroupedSummary([]));
    const [reportFailed, setReportFailed] = useState<boolean>(false);
    const [invalidFields, setInvalidFields] = useState<Group>({ title: "Invalid fields", records: {} });
    const [allInvalid, setAllInvalid] = useState<boolean>(false);

    function defaultState() {
        setMessageNoData("");
        setReportFailed(false);
        setGroupedSummary(new GroupedSummary([]));
        setInterviewerID("");
        setInvalidFields({ title: "Invalid fields", records: {} });
        setAllInvalid(false);
    }

    function groupData(callPatternReport: InterviewerCallPatternReport) {
        const callTimes: Group = callTimeSection(callPatternReport);
        const callStatus: Group = callStatusSection(callPatternReport);
        const noContactBreakdown: Group = noContactBreakdownSection(callPatternReport);
        const groupedSummary = new GroupedSummary([callTimes, callStatus, noContactBreakdown]);

        console.log(groupedSummary);
        setGroupedSummary(groupedSummary);
        setInvalidFields(invalidFieldsGroup(callPatternReport));
        return;
    }

    function InvalidCaseInfo(): ReactElement {
        console.log(invalidFields);
        if (invalidFields.records.discounted_invalid_cases) {
            const total = `${invalidFields.records.discounted_invalid_cases}/${invalidFields.records.total_records}`;
            const percentage = invalidFields.records.discounted_invalid_cases / invalidFields.records.total_records * 100;

            return (
                <ONSPanel>
                    <p>Information: {total} records ({percentage.toFixed(2)}%) were discounted due to the following invalid fields: {invalidFields.records.invalid_fields}</p>
                </ONSPanel>
            );
        }
        return (<></>);
    }

    async function runInterviewerCallPatternReport(formValues: Record<string, any>, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        defaultState();

        formValues.survey_tla = formValues["Survey TLA"];
        formValues.interviewer = formValues["Interviewer ID"];
        formValues.start_date = new Date(formValues["Start date"]);
        formValues.end_date = new Date(formValues["End date"]);

        setInterviewerID(formValues.interviewer);

        let callPatternReport: InterviewerCallPatternReport | undefined;

        try {
            callPatternReport = await getInterviewerCallPatternReport(formValues);
        } catch {
            setReportFailed(true);
            return;
        } finally {
            setSubmitting(false);
        }

        if (!callPatternReport) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        callPatternReport.total_records = callPatternReport.discounted_invalid_cases
            + (callPatternReport.total_valid_cases || 0);

        if (isAllInvalid(callPatternReport)) {
            setInvalidFields(invalidFieldsGroup(callPatternReport));
            setAllInvalid(true);
            return;
        }

        groupData(callPatternReport);
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{ link: "/", title: "Back" }]} />
            <main id="main-content" className="page__main u-mt-s">
                <h1 className="u-mb-m">Run interviewer call pattern report</h1>
                <ReportErrorPanel error={reportFailed} />
                <CallHistoryLastUpdatedStatus />
                <div className="u-mb-m">
                    <ONSPanel>
                        <p>
                            Incomplete data is removed from this report. This will impact the accuracy of the report.
                        </p>
                        <p>
                            The <b>Discounted invalid records</b> entry will advise how many records have been removed.
                        </p>
                        <p>
                            Information will be displayed at the top of the report to advise which fields were incomplete.
                        </p>
                    </ONSPanel>
                </div>
                <SurveyInterviewerStartDateEndDateForm onSubmitFunction={runInterviewerCallPatternReport} />
                <br />
                <CSVLink
                    hidden={groupedSummary.groups.length === 0}
                    data={groupedSummary.csv()}
                    target="_blank"
                    filename={`interviewer-call-pattern-${interviewerID}.csv`}>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>
                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {

                        allInvalid
                            ?
                            <InvalidCaseInfo />
                            :

                            groupedSummary.groups.length > 0
                                ?
                                <>
                                    <InvalidCaseInfo />
                                    <div className="summary u-mt-m">
                                        <div className="summary__group" id="report-table">
                                            <SummaryGroupTable groupedSummary={groupedSummary} />
                                        </div>
                                    </div>
                                </>
                                :
                                <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                    }
                    <br />
                </ErrorBoundary>
            </main>
        </>
    );
}

export { formatToFractionAndPercentage, callTimeSection, callStatusSection, noContactBreakdownSection, invalidFieldsGroup, isAllInvalid };
export default InterviewerCallPattern;
