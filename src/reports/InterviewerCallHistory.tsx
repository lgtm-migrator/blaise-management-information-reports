import React, {ChangeEvent, ReactElement, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";
import {requestPromiseJson} from "./requestPromise";

function InterviewerCallHistory(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);
    const [listError, setListError] = useState<string>("");

    async function runReport(formData: any) {
        setInterviewerID(formData.interviewer_id);
        setStartDate(formData.start_date);
        setEndDate(formData.end_date);

        const url = "/api/reports/interviewer-call-history";

        return new Promise((resolve: (object: boolean) => void) => {

        requestPromiseJson("POST", url, formData).then(([status, formData]) => {
            console.log(`Response: Status ${status}, data ${formData}`);
            if (status === 201) {
                resolve(true);
            } else {
                resolve(false);
                setMessage(`Response: ${status}`);
            }
        }).catch((error: Error) => {
            console.error(`Response: Error ${error}`);
            setMessage(`Response: Error ${error}`);
            resolve(false);
        });
    });
    }

    return (
        <>
            <p className="u-mt-m">
                <Link to={"/"}>Previous</Link>
            </p>
            <h1>Run interviewer call history report</h1>
            <ONSPanel hidden={(message === "")} status="error">
                {message}
            </ONSPanel>
            <Form onSubmit={(data) => runReport(data)}>
                <FormTextInput
                    name="interviewer_id"
                    validators={[requiredValidator]}
                    label={"Interviewer ID"}
                />
                <FormTextInput
                    name="start_date"
                    validators={[requiredValidator]}
                    label={"Start Date"}
                />
                <FormTextInput
                    name="end_date"
                    validators={[requiredValidator]}
                    label={"End Date"}
                />
                <br />
                <ONSButton
                    label={"Run"}
                    primary={true}
                    loading={buttonLoading}
                    submit={true}/>
            </Form>

        </>
    );
}

export default InterviewerCallHistory;
