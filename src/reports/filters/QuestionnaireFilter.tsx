import React, { ReactElement } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import FilterSummary from "../../components/FilterSummary";
import QuestionnaireSelector from "../../components/QuestionnaireSelector";

interface QuestionnaireFilterPageProps {
    interviewer: string
    startDate: Date
    endDate: Date
    surveyTla: string
    questionnaires: string[]
    setQuestionnaires: (string: string[]) => void
    submitFunction: () => void
    navigateBack: () => void
}

function QuestionnaireFilter(props: QuestionnaireFilterPageProps): ReactElement {
    const {
        interviewer,
        startDate,
        endDate,
        navigateBack,
    } = props;

    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={[{ link: "/", title: "Reports" }, {
                        link: "#",
                        onClickFunction: navigateBack,
                        title: "Interviewer details"
                    }]}/>
                <main id="main-content" className="page__main u-mt-s">
                    <h1>Select questionnaires for</h1>
                    <FilterSummary {...props}/>
                    <CallHistoryLastUpdatedStatus/>
                    <QuestionnaireSelector {...props}/>
                </main>
            </div>
        </>
    );
}

export default QuestionnaireFilter;
