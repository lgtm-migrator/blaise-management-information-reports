import React, { ReactElement, useState } from "react";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AppointmentFilter from "../filters/AppointmentFilter";
import AppointmentInstrumentFilter from "../filters/AppointmentInstrumentFilter";
import RenderAppointmentResourcePlanningReport from "./RenderAppointmentResourcePlanningReport";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

enum Step {
    AppointmentFilter,
    InstrumentFilter,
    RenderReport,
}

function AppointmentResourcePlanning(): ReactElement {
    const [activeStep, setActiveStep] = useState<Step>(Step.AppointmentFilter);
    const [reportDate, setReportDate] = useState<Date>(new Date());
    const [surveyTla, setSurveyTla] = useState<string>("");
    const [instruments, setInstruments] = useState<string[]>([]);

    function _renderStepContent(step: number) {
        switch (step) {
            case Step.AppointmentFilter:
                return (<AppointmentFilter title="appointment resource planning"
                                           reportDate={reportDate} setReportDate={setReportDate}
                                           surveyTla={surveyTla} setSurveyTla={setSurveyTla}
                                           submitFunction={_handleSubmit}/>);
            case Step.InstrumentFilter:
                return (<AppointmentInstrumentFilter reportDate={reportDate}
                                          surveyTla={surveyTla}
                                          instruments={instruments} setInstruments={setInstruments}
                                          submitFunction={_handleSubmit}
                                          navigateBack={_navigateBack}/>);
            case Step.RenderReport:
                console.log(`Steps instruments ${instruments}`);
                return (<RenderAppointmentResourcePlanningReport reportDate={reportDate}
                                                            surveyTla={surveyTla}
                                                            questionnaires={instruments}
                                                            navigateBack={_navigateBack}
                                                            navigateBackTwoSteps={_navigateBackTwoSteps}/>);
        }
        
    } 

    async function _handleSubmit() {
        switch (activeStep) {
            case Step.AppointmentFilter:
                setActiveStep(Step.InstrumentFilter);
                break;
            case Step.InstrumentFilter:
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
