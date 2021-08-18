import React from "react";
import {StyledForm} from "blaise-design-system-react-components";

const InterviewerCallHistoryForm = () => {
    const fields = [
        {
            name: "Interviewer ID",
            type: "text",
        },
        {
            name: "Start Date",
            type: "date",

        },
        {
            name: "End Date",
            type: "date",
        }
    ];

    const submit = () => {
        console.log("done");
    };


    return (
        <>
            <p>HIYA!</p>
            <StyledForm fields={fields} onSubmitFunction={submit}/>

        </>
    );
};

export default InterviewerCallHistoryForm;
