import React, {ReactElement} from "react";
import {StyledForm} from "blaise-design-system-react-components";

interface Props {
    onSubmitFunction: any;
}

const SurveyInterviewerStartDateEndDateForm = ({onSubmitFunction}: Props): ReactElement => {

    const validateInterviewer = (value: string) => {
        let error;
        if (value === "") {
            error = "Enter a valid interviewer ID";
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
            name: "Survey TLA",
            description: "Select survey",
            type: "radio",
            radioOptions: [
                {id: "all", value: "undefined", label: "Show all surveys"},
                {id: "lms", value: "lms", label: "LMS", description: "Labour Market Survey"},
                {id: "opn", value: "opn", label: "OPN", description: "Opinions and Lifestyle Survey"}
            ]
        },
        {
            name: "Interviewer ID",
            type: "text",
            validate: validateInterviewer
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

export default SurveyInterviewerStartDateEndDateForm;
