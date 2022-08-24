import React, { ReactElement } from "react";
import { StyledForm } from "blaise-design-system-react-components";
import { EndDateField, InterviewerField, StartDateField, SurveyField } from "./FormFields";

interface Props {
    interviewer: string | undefined
    surveyTLA: string | undefined
    startDate: Date
    endDate: Date
    onSubmitFunction: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void;
}

const SurveyInterviewerStartDateEndDateForm = ({
    interviewer,
    surveyTLA,
    startDate,
    endDate,
    onSubmitFunction
}: Props): ReactElement => {

    const fields = [
        SurveyField(surveyTLA),
        InterviewerField(interviewer),
        StartDateField(startDate),
        EndDateField(endDate),
    ];

    return (
        <><StyledForm fields={fields} onSubmitFunction={onSubmitFunction} submitLabel={"Next"}/></>
    );
};

export default SurveyInterviewerStartDateEndDateForm;
