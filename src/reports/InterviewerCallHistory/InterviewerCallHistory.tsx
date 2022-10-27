import React, { ReactElement, useMemo, useState } from "react";
import InterviewerFilter, { InterviewerFilterQuery } from "../filters/InterviewerFilter";
import QuestionnaireFilter from "../filters/QuestionnaireFilter";
import RenderInterviewerCallHistoryReport from "./RenderInterviewerCallHistoryReport";

enum Step {
    InterviewerFilter,
    QuestionnaireFilter,
    RenderReport,
}

function InterviewerCallHistory(): ReactElement {
    const [activeStep, setActiveStep] = useState<Step>(Step.InterviewerFilter);
    const [interviewerFilterQuery, setInterviewerFilterQuery] = useState<InterviewerFilterQuery>({
        interviewer: "",
        startDate: new Date(),
        endDate: new Date(),
        surveyTla: "",
    });
    const [questionnaires, setQuestionnaires] = useState<string[]>([]);

    const currentStep = useMemo(() => {
        switch (activeStep) {
            case Step.InterviewerFilter:
                return (
                    <InterviewerFilter
                        title="call history"
                        query={interviewerFilterQuery}
                        onSubmit={_handleInterviewerFilterSubmit}
                    />
                );
            case Step.QuestionnaireFilter:
                return (
                    <QuestionnaireFilter
                        interviewerFilterQuery={interviewerFilterQuery}
                        questionnaires={questionnaires}
                        setQuestionnaires={setQuestionnaires}
                        onSubmit={_handleQuestionnaireFilterSubmit}
                        navigateBack={_navigateBack}
                    />
                );
            case Step.RenderReport:
                console.log(`Steps questionnaires ${questionnaires}`);
                return (
                    <RenderInterviewerCallHistoryReport
                        interviewerFilterQuery={interviewerFilterQuery}
                        questionnaires={questionnaires}
                        navigateBack={_navigateBack}
                        navigateBackTwoSteps={_navigateBackTwoSteps}
                    />
                );
        }
    }, [activeStep]);

    function _handleInterviewerFilterSubmit(query: InterviewerFilterQuery) {
        setInterviewerFilterQuery(query);
        setActiveStep(Step.QuestionnaireFilter);
    }

    function _handleQuestionnaireFilterSubmit() {
        setActiveStep(Step.RenderReport);
    }

    function _navigateBack() {
        setActiveStep(activeStep - 1);
    }

    function _navigateBackTwoSteps() {
        setActiveStep(activeStep - 2);
    }

    return (
        <div>
            <div className="u-mt-m">
                { currentStep }
            </div>
        </div>
    );
}

export default InterviewerCallHistory;
