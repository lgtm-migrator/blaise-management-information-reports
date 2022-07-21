import React, { ReactElement } from "react";
import { StyledForm } from "blaise-design-system-react-components";
import { mirStandardFormatForNewDate } from "../utilities/Helpers";

interface Props {
    onSubmitFunction: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void;
}

const SurveyDateForm = ({ onSubmitFunction }: Props): ReactElement => {

    const fields = [
        {
            name: "Survey TLA",
            description: "Select survey",
            type: "radio",
            initial_value: "undefined",
            radioOptions: [
                { id: "all", value: "undefined", label: "Show all surveys" },
                { id: "lms", value: "lms", label: "LMS", description: "Labour Market Survey" },
                { id: "opn", value: "opn", label: "OPN", description: "Opinions and Lifestyle Survey" }
            ]
        },
        {
            name: "Date",
            type: "date",
            initial_value: mirStandardFormatForNewDate(),
        }
    ];

    return (
        <>
            <StyledForm fields={fields} onSubmitFunction={onSubmitFunction} submitLabel={"Run"} />
        </>
    );
};

export default SurveyDateForm;
