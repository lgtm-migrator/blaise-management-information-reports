import React, {ReactElement} from "react";
import {StyledForm} from "blaise-design-system-react-components";

interface Props {
    onSubmitFunction: any;
}

const SurveyInterviewerStartEndDateForm = ({onSubmitFunction}: Props): ReactElement => {

    const validateInterviewer = (value: string) => {
        let error;

        if (value === "") {
            error = "Enter interviewer ID";
        }
        return error;
    };

    const validateDate = (value: string) => {
        let error;

        if (value === "") {
            error = "Enter a valid date";
        }
        return error;
    };

    const fields = [
        {
            name: "surveyTLA",
            description: "Select survey",
            type: "radio",
            radioOptions: [
                {id: "all", value: "undefined", label: "Show all surveys"},
                {id: "lms", value: "lms", label: "LMS"},
                {id: "opn", value: "opn", label: "OPN"}
            ]
        },
        {
            name: "Interviewer ID",
            type: "text",
            validate: validateInterviewer,
            defaultValue: "matpal"
        },
        {
            name: "Start date",
            type: "date",
            // validate: validateDate
        },
        {
            name: "End date",
            type: "date",
            // validate: validateDate
        }
    ];

    return (
        <>
            <StyledForm fields={fields} onSubmitFunction={onSubmitFunction}/>
        </>
    );
};

export default SurveyInterviewerStartEndDateForm;
