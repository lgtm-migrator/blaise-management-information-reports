import React, {ReactElement, useState} from "react";
import InterviewerFilter from "../filters/InterviewerFilter";
import QuestionnaireFilter from "../filters/QuestionnaireFilter";
import RenderInterviewerCallPatternReport from "../InterviewerCallPattern/RenderInterviewerCallPatternReport";

enum Step {
    InterviewerFilter,
    QuestionnaireFilter,
    RenderReport,
}

function InterviewerCallPattern(): ReactElement {
    const [activeStep, setActiveStep] = useState<Step>(Step.InterviewerFilter);
    const [interviewer, setInterviewer] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [surveyTla, setSurveyTla] = useState<string>("");
    const [questionnaires, setQuestionnaires] = useState<string[]>([]);

    function _renderStepContent(step: number) {
        switch (step) {
            case Step.InterviewerFilter:
                return (<InterviewerFilter title="call pattern"
                                           interviewer={interviewer} setInterviewer={setInterviewer}
                                           startDate={startDate} setStartDate={setStartDate}
                                           endDate={endDate} setEndDate={setEndDate}
                                           surveyTla={surveyTla} setSurveyTla={setSurveyTla}
                                           submitFunction={_handleSubmit}/>);
            case Step.QuestionnaireFilter:
                return (<QuestionnaireFilter interviewer={interviewer}
                                             startDate={startDate}
                                             endDate={endDate}
                                             surveyTla={surveyTla}
                                             questionnaires={questionnaires} setQuestionnaires={setQuestionnaires}
                                             submitFunction={_handleSubmit}
                                             navigateBack={_navigateBack}/>);
            case Step.RenderReport:
                console.log(`Steps questionnaires ${questionnaires}`);
                return (<RenderInterviewerCallPatternReport interviewer={interviewer}
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            surveyTla={surveyTla}
                                                            questionnaires={questionnaires}
                                                            navigateBack={_navigateBack}
                                                            navigateBackTwoSteps={_navigateBackTwoSteps}/>);
        }
    }

    async function _handleSubmit() {
        switch (activeStep) {
            case Step.InterviewerFilter:
                setActiveStep(Step.QuestionnaireFilter);
                break;
            case Step.QuestionnaireFilter:
                setActiveStep(Step.RenderReport);
                break;
            default:
                setActiveStep(Step.QuestionnaireFilter);
        }
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
                {_renderStepContent(activeStep)}
            </div>
        </div>
    );
}

export default InterviewerCallPattern;
