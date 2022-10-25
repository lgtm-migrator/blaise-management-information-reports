import React, { ReactElement, useState } from "react";
import AppointmentFilter from "../filters/AppointmentFilter";
import AppointmentQuestionnaireFilter from "../filters/AppointmentQuestionnaireFilter";
import RenderAppointmentResourcePlanningReport from "./RenderAppointmentResourcePlanningReport";

enum Step {
    AppointmentFilter,
    QuestionnaireFilter,
    RenderReport,
}

function AppointmentResourcePlanning(): ReactElement {
    const [activeStep, setActiveStep] = useState<Step>(Step.AppointmentFilter);
    const [reportDate, setReportDate] = useState<Date>(new Date());
    const [surveyTla, setSurveyTla] = useState<string>("");
    const [questionnaires, setQuestionnaires] = useState<string[]>([]);

    function _renderStepContent(step: number) {
        switch (step) {
        case Step.AppointmentFilter:
            return (<AppointmentFilter title="appointment resource planning"
                reportDate={reportDate} setReportDate={setReportDate}
                surveyTla={surveyTla} setSurveyTla={setSurveyTla}
                submitFunction={_handleSubmit}/>);
        case Step.QuestionnaireFilter:
            return (<AppointmentQuestionnaireFilter reportDate={reportDate}
                surveyTla={surveyTla}
                questionnaires={questionnaires} setQuestionnaires={setQuestionnaires}
                submitFunction={_handleSubmit}
                navigateBack={_navigateBack}/>);
        case Step.RenderReport:
            console.log(`Steps questionnaires ${questionnaires}`);
            return (<RenderAppointmentResourcePlanningReport reportDate={reportDate}
                surveyTla={surveyTla}
                questionnaires={questionnaires}
                navigateBack={_navigateBack}
                navigateBackTwoSteps={_navigateBackTwoSteps}/>);
        }

    }

    async function _handleSubmit() {
        switch (activeStep) {
        case Step.AppointmentFilter:
            setActiveStep(Step.QuestionnaireFilter);
            break;
        case Step.QuestionnaireFilter:
            setActiveStep(Step.RenderReport);
            break;
        default:
            setActiveStep(Step.AppointmentFilter);
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

export default AppointmentResourcePlanning;
