import React, { ReactElement } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import FilterSummary from "../../components/FilterSummary";
import QuestionnaireSelector from "../../components/QuestionnaireSelector";
import { InterviewerFilterQuery } from "./InterviewerFilter";

interface QuestionnaireFilterPageProps {
    interviewerFilterQuery: InterviewerFilterQuery,
    questionnaires: string[]
    setQuestionnaires: (string: string[]) => void
    submitFunction: () => void
    navigateBack: () => void
}

function QuestionnaireFilter(props: QuestionnaireFilterPageProps): ReactElement {
    const {
        navigateBack,
        questionnaires,
        interviewerFilterQuery,
    } = props;

    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={ [
                        { link: "/", title: "Reports" },
                        { link: "#", onClickFunction: navigateBack, title: "Interviewer details" }
                    ] }/>
                <main id="main-content" className="page__main u-mt-s">
                    <h1>Select questionnaires for</h1>
                    <FilterSummary { ...interviewerFilterQuery } questionnaires={ questionnaires }/>
                    <CallHistoryLastUpdatedStatus/>
                    <QuestionnaireSelector
                        { ...interviewerFilterQuery }
                        questionnaires={questionnaires}
                        setQuestionnaires={props.setQuestionnaires}
                        submitFunction={props.submitFunction}
                    />
                </main>
            </div>
        </>
    );
}

export default QuestionnaireFilter;
