import React, { ReactElement } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import QuestionnaireSelector from "../../components/QuestionnaireSelector";
import { bstDateFormatter } from "../../utilities/Helpers";

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
                    <h3 className="u-mb-m">
                        Interviewer: {interviewer}<br></br>
                        Period: {bstDateFormatter(startDate)}–{bstDateFormatter(endDate)}
                    </h3>
                    <CallHistoryLastUpdatedStatus/>
                    <QuestionnaireSelector {...props}/>
                </main>
            </div>
        </>
    );
}

export default QuestionnaireFilter;
