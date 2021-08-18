import React, {ReactElement} from "react";
import {StyledForm} from "blaise-design-system-react-components";


interface Props {
    onSubmitFunction: any
}

const InterviewerCallHistoryForm = ({onSubmitFunction}: Props) : ReactElement => {
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
        },
        {
            name: "Start date",
            type: "date",

        },
        {
            name: "End date",
            type: "date",
        }
    ];

    return (
        <>
            <StyledForm fields={fields} onSubmitFunction={onSubmitFunction}/>
        </>
    );
};

export default InterviewerCallHistoryForm;
