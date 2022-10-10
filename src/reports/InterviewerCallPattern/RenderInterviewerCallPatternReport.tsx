import React, { ReactElement, ReactNode, useCallback, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import { Group, GroupedSummary, ONSPanel, SummaryGroupTable } from "blaise-design-system-react-components";
import { CSVLink } from "react-csv";
import ReportErrorPanel from "../../components/ReportErrorPanel";
import { InterviewerCallPatternReport } from "../../interfaces";
import { getInterviewerCallPatternReport } from "../../utilities/HTTP";
import FilterSummary from "../../components/FilterSummary";
import { LoadData } from "../../components/LoadData";

interface RenderInterviewerCallPatternReportPageProps {
    interviewer: string;
    startDate: Date;
    endDate: Date;
    surveyTla: string;
    questionnaires: string[];
    navigateBack: () => void;
    navigateBackTwoSteps: () => void;
}

function formatToFractionAndPercentage(numerator: number | undefined, denominator: number | undefined): string {
    if (!numerator) {
        numerator = 0;
    }
    if (denominator === 0 || denominator === undefined) {
        console.warn("Cannot divide by 0");
        return "0/0, 0%";
    }
    return `${ numerator }/${ denominator }, ${ (numerator / denominator * 100).toFixed(2) }%`;
}

function callTimeSection(callPatternReport: InterviewerCallPatternReport): Group {
    return {
        title: "Call times",
        records: {
            hours_worked: callPatternReport.hours_worked,
            call_time: callPatternReport.call_time,
            hours_on_calls_percentage: `${ (callPatternReport.hours_on_calls_percentage || 0).toFixed(2) }%`,
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
            invalid_telephone_number: formatToFractionAndPercentage(callPatternReport.no_contact_invalid_telephone_number, callPatternReport.no_contacts),
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

function groupData(callPatternReport: InterviewerCallPatternReport) {
    const callTimes: Group = callTimeSection(callPatternReport);
    const callStatus: Group = callStatusSection(callPatternReport);
    const noContactBreakdown: Group = noContactBreakdownSection(callPatternReport);
    return new GroupedSummary([callTimes, callStatus, noContactBreakdown]);
}

function InvalidCaseInfo({ invalidFields }: { invalidFields: Group }): ReactElement {
    console.log(invalidFields);
    if (!invalidFields.records.discounted_invalid_cases) {
        return <></>;
    }
    const total = `${ invalidFields.records.discounted_invalid_cases }/${ invalidFields.records.total_records }`;
    const percentage = invalidFields.records.discounted_invalid_cases / invalidFields.records.total_records * 100;

    return (
        <ONSPanel>
            <p>Information: { total } records ({ percentage.toFixed(2) }%) were discounted due to the following
                invalid fields: { invalidFields.records.invalid_fields }</p>
        </ONSPanel>
    );
}

function DownloadCSVLink(
    { groupedSummary, filename }: { groupedSummary: GroupedSummary, filename: string }
): ReactElement {
    return (
        <CSVLink
            hidden={ groupedSummary.groups.length === 0 }
            data={ groupedSummary.csv() }
            target="_blank"
            filename={ filename }>
            Export report as Comma-Separated Values (CSV) file
        </CSVLink>
    );
}

function ReportData(
    { groupedSummary, summaryState }: { groupedSummary: GroupedSummary, summaryState: SummaryState }
): ReactElement {
    if (summaryState === "no_data") {
        return <ONSPanel>No data found for parameters given.</ONSPanel>;
    }

    if (groupedSummary.groups.length === 0) {
        return <></>;
    }

    return (
        <>
            <div className="summary u-mt-m">
                <div className="summary__group" id="report-table">
                    <SummaryGroupTable groupedSummary={ groupedSummary }/>
                </div>
            </div>
        </>
    );
}

type SummaryState = "load_failed" | "no_data" | "all_invalid_fields" | "loaded"

function RenderInterviewerCallPatternReport({
    surveyTla,
    interviewer,
    startDate,
    endDate,
    questionnaires,
    navigateBack,
    navigateBackTwoSteps,
}: RenderInterviewerCallPatternReportPageProps): ReactElement {
    const [reportFailed] = useState<boolean>(false);

    async function runInterviewerCallPatternReport(): Promise<[SummaryState, GroupedSummary, Group]> {
        const formValues: Record<string, any> = {};
        formValues.survey_tla = surveyTla;
        formValues.interviewer = interviewer;
        formValues.start_date = startDate;
        formValues.end_date = endDate;
        formValues.questionnaires = questionnaires;

        try {
            const callHistory: InterviewerCallPatternReport | undefined = await getInterviewerCallPatternReport(formValues);

            if (callHistory === undefined) {
                return ["no_data", new GroupedSummary([]), { title: "", records: {} }];
            }

            callHistory.total_records = callHistory.discounted_invalid_cases
                + (callHistory.total_valid_cases || 0);

            if (isAllInvalid(callHistory)) {
                return ["all_invalid_fields", new GroupedSummary([]), invalidFieldsGroup(callHistory)];
            }

            return ["loaded", groupData(callHistory), invalidFieldsGroup(callHistory)];
        } catch {
            return ["load_failed", new GroupedSummary([]), { title: "", records: {} }];
        }

    }

    const displayReport = useCallback(
        ([state, groupedSummary, invalidFields]: [SummaryState, GroupedSummary, Group]): ReactNode => (
            <>
                <DownloadCSVLink
                    groupedSummary={ groupedSummary }
                    filename={ `interviewer-call-pattern-${ interviewer }.csv` }/>
                <InvalidCaseInfo invalidFields={ invalidFields }/>
                <ReportData groupedSummary={ groupedSummary } summaryState={ state }/>
            </>
        ),
        []
    );

    return (
        <>
            <Breadcrumbs BreadcrumbList={ [
                { link: "/", title: "Reports" },
                { link: "#", onClickFunction: navigateBackTwoSteps, title: "Interviewer details" },
                { link: "#", onClickFunction: navigateBack, title: "Questionnaires" }
            ] }/>
            <main id="main-content" className="page__main u-mt-s">
                <h1>Call Pattern Report</h1>
                <FilterSummary
                    interviewer={ interviewer }
                    startDate={ startDate }
                    endDate={ endDate }
                    questionnaires={ questionnaires }
                />
                <ReportErrorPanel error={ reportFailed }/>
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
                            Information will be displayed at the top of the report to advise which fields were
                            incomplete.
                        </p>
                    </ONSPanel>
                </div>
                <br/>
                <LoadData dataPromise={ runInterviewerCallPatternReport() }>{ displayReport }</LoadData>
                <br/>
            </main>
        </>
    );
}

export {
    formatToFractionAndPercentage,
    callStatusSection,
    noContactBreakdownSection,
    invalidFieldsGroup,
    isAllInvalid
};
export default RenderInterviewerCallPatternReport;
