import React, { ReactElement } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import SurveyInterviewerStartDateEndDateForm from "../../components/SurveyInterviewerStartDateEndDateForm";

interface InterviewerFilterPageProps {
    title: string
    interviewer: string | undefined
    setInterviewer: (string: string) => void
    startDate: Date
    setStartDate: (Date: Date) => void
    endDate: Date
    setEndDate: (Date: Date) => void
    surveyTla: string | undefined
    setSurveyTla: (string: string) => void
    submitFunction: () => void;
}

function InterviewerFilter(props: InterviewerFilterPageProps): ReactElement {
    const {
        title,
        interviewer,
        setInterviewer,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        surveyTla,
        setSurveyTla,
        submitFunction
    } = props;

    async function submitInterviewerFilters(formValues: Record<string, any>, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        setInterviewer(formValues["Interviewer ID"]);
        setStartDate(formValues["Start date"]);
        setEndDate(formValues["End date"]);
        setSurveyTla(formValues["Survey TLA"]);
        setSubmitting(true);
        submitFunction();
    }

    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={[{ link: "/", title: "Reports" }]}/>
                <main id="main-content" className="page__main u-mt-s">
                    <h1 className="u-mb-m">Run interviewer {title} report</h1>
                    <CallHistoryLastUpdatedStatus/>
                    <SurveyInterviewerStartDateEndDateForm
                        interviewer={interviewer}
                        surveyTLA={surveyTla}
                        startDate={startDate}
                        endDate={endDate}
                        onSubmitFunction={submitInterviewerFilters} />
                </main>
            </div>
        </>
    );
}

export default InterviewerFilter;

