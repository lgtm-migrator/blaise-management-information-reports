import React, { ReactElement, useState } from "react";
import { ErrorBoundary, ONSPanel, SummaryGroupTable, GroupedSummary, Group } from "blaise-design-system-react-components";
import { getInterviewerCallPatternReport } from "../utilities/HTTP";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CSVLink } from "react-csv";
import Breadcrumbs from "../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../components/CallHistoryLastUpdatedStatus";
import SurveyInterviewerStartDateEndDateForm from "../components/SurveyInterviewerStartDateEndDateForm";
import ReportErrorPanel from "../components/ReportErrorPanel";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function formatToFractionAndPercentage(numerator: number, denominator: number): string {
    if (denominator === 0) {
        console.warn("Cannot divide by 0");
        return "0/0, 0%";
    }
    return `${numerator}/${denominator}, ${(numerator / denominator * 100).toFixed(2)}%`;
}

function callTimeSection(data: Record<string, any>): Group {
    return {
        title: "Call times",
        records: {
            hours_worked: data.hours_worked,
            call_time: data.call_time,
            hours_on_calls_percentage: `${data.hours_on_calls_percentage.toFixed(2)}%`,
            average_calls_per_hour: data.average_calls_per_hour
        }
    };
}

function callStatusSection(data: Record<string, any>): Group {
    return {
        title: "Call status",
        records: {
            refusals: formatToFractionAndPercentage(data.refusals, data.total_valid_cases),
            completed_successfully: formatToFractionAndPercentage(data.completed_successfully, data.total_valid_cases),
            appointments_for_contacts: formatToFractionAndPercentage(data.appointments_for_contacts, data.total_valid_cases),
            no_contacts: formatToFractionAndPercentage(data.no_contacts, data.total_valid_cases),
            discounted_invalid_cases: formatToFractionAndPercentage(data.discounted_invalid_cases, data.total_records),
        }
    };
}

function noContactBreakdownSection(data: Record<string, any>): Group {
    return {
        title: "Breakdown of No Contact calls",
        records: {
            answer_service: formatToFractionAndPercentage(data.no_contact_answer_service, data.no_contacts),
            busy: formatToFractionAndPercentage(data.no_contact_busy, data.no_contacts),
            disconnect: formatToFractionAndPercentage(data.no_contact_disconnect, data.no_contacts),
            no_answer: formatToFractionAndPercentage(data.no_contact_no_answer, data.no_contacts),
            other: formatToFractionAndPercentage(data.no_contact_other, data.no_contacts),
        }
    };
}

function invalidFieldsGroup(data: Record<string, any>): Group {
    return {
        title: "Invalid Fields",
        records: {
            invalid_fields: data.invalid_fields,
            discounted_invalid_cases: data.discounted_invalid_cases,
            total_records: data.total_records
        }
    };
}

function isAllInvalid(data: Record<string, any>): boolean {
    return !data.total_valid_cases;
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

    function groupData(data: any) {
        const callTimes: Group = callTimeSection(data);
        const callStatus: Group = callStatusSection(data);
        const noContactBreakdown: Group = noContactBreakdownSection(data);
        const groupedSummary = new GroupedSummary([callTimes, callStatus, noContactBreakdown]);

        console.log(groupedSummary);
        setGroupedSummary(groupedSummary);
        setInvalidFields(invalidFieldsGroup(data));
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

    async function runInterviewerCallPatternReport(formValues: any, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        defaultState();

        formValues.survey_tla = formValues["Survey TLA"];
        formValues.interviewer = formValues["Interviewer ID"];
        formValues.start_date = new Date(formValues["Start date"]);
        formValues.end_date = new Date(formValues["End date"]);

        setInterviewerID(formValues.interviewer);

        const [success, data] = await getInterviewerCallPatternReport(formValues);
        setSubmitting(false);

        if (!success) {
            setReportFailed(true);
            return;
        }

        if (data.length === 0) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        data.total_records = data.discounted_invalid_cases;
        if (data.total_valid_cases) {
            data.total_records = data.total_valid_cases + data.discounted_invalid_cases;
        }

        if (isAllInvalid(data)) {
            setInvalidFields(invalidFieldsGroup(data));
            setAllInvalid(true);
            return;
        }

        groupData(data);
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


