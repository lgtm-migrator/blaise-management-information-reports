import React, { ReactElement } from "react";
import { StyledForm } from "blaise-design-system-react-components";
import { formatISODate } from "../utilities/DateFormatter";
import { SurveyField } from "./SurveyField";

interface Props {
    onSubmitFunction: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void;
}

const SurveyDateForm = ({ onSubmitFunction }: Props): ReactElement => {

    const fields = [
        SurveyField("undefined"),
        {
            name: "Date",
            type: "date",
            initial_value: formatISODate(new Date()),
        }
    ];

    return (
        <>
            <StyledForm fields={fields} onSubmitFunction={onSubmitFunction} submitLabel={"Run"} />
        </>
    );
};

export default SurveyDateForm;
