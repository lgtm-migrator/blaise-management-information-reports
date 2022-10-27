import React, {
    ReactElement, useCallback, useMemo, useState,
} from "react";
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

    const _handleSubmit = useCallback(async () => {
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
    }, [setActiveStep, activeStep]);

    const _navigateBack = useCallback(() => {
        setActiveStep((current) => current - 1);
    }, [setActiveStep]);

    const _navigateBackTwoSteps = useCallback(() => {
        setActiveStep((current) => current - 2);
    }, [setActiveStep]);

    const currentStep = useMemo(() => {
        switch (activeStep) {
            case Step.AppointmentFilter:
                return (
                    <AppointmentFilter
                        title="appointment resource planning"
                        reportDate={reportDate}
                        setReportDate={setReportDate}
                        surveyTla={surveyTla}
                        setSurveyTla={setSurveyTla}
                        submitFunction={_handleSubmit}
                    />
                );
            case Step.QuestionnaireFilter:
                return (
                    <AppointmentQuestionnaireFilter
                        reportDate={reportDate}
                        surveyTla={surveyTla}
                        questionnaires={questionnaires}
                        setQuestionnaires={setQuestionnaires}
                        submitFunction={_handleSubmit}
                        navigateBack={_navigateBack}
                    />
                );
            case Step.RenderReport:
                console.log(`Steps questionnaires ${questionnaires}`);
                return (
                    <RenderAppointmentResourcePlanningReport
                        reportDate={reportDate}
                        surveyTla={surveyTla}
                        questionnaires={questionnaires}
                        navigateBack={_navigateBack}
                        navigateBackTwoSteps={_navigateBackTwoSteps}
                    />
                );
        }
    }, [activeStep, reportDate, surveyTla, questionnaires, _navigateBack, _navigateBackTwoSteps]);

    return (
        <div>
            <div className="u-mt-m">
                {currentStep}
            </div>
        </div>
    );
}

export default AppointmentResourcePlanning;
