import React, {ChangeEvent, ReactElement, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";
import {getReport} from "../utilities/http";
import {ErrorBoundary} from "../Components/ErrorHandling/ErrorBoundary";

function InterviewerCallHistory(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [listReportData, setListReportData] = useState<any[]>([]);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [listError, setListError] = useState<string>("");

    async function runReport(formData: any) {
        setInterviewerID(formData.interviewer_id);
        setStartDate(formData.start_date);
        setEndDate(formData.end_date);

        const [success, list] = await getReport(formData);

        if (!success) {
            setMessage("Error running report");
            return;
        }

        console.log(list);
        setListReportData(list);

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
                <p>
                    <FormTextInput
                        name="interviewer"
                        validators={[requiredValidator]}
                        label={"Interviewer ID"}
                    />
                </p>
                <ONSDateInput
                    label={"Start Date"}
                />
                <ONSDateInput
                    label={"End Date"}
                    date={endDate}
                    onChange={(date) => setEndDate(date)}
                />
                <br />
                <ONSButton
                    label={"Run"}
                    primary={true}
                    loading={buttonLoading}
                    submit={true}/>
            </Form>

            <ErrorBoundary errorMessageText={"Failed to load"}>
                {
                    listReportData && listReportData.length > 0
                        ?
                        <table id="batches-table" className="table ">
                            <thead className="table__head u-mt-m">
                            <tr className="table__row">
                                {/*
                                <th scope="col" className="table__header ">
                                    <span>Interviewer ID</span>
                                </th>
                                */}
                                <th scope="col" className="table__header ">
                                    <span>Questionnaire</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Serial Number</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Call Start Time</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Call Length</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Interviews</span>
                                </th>
                                <th scope="col" className="table__header ">
                                    <span>Call Result</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="table__body">
                            {
                                listReportData.map((batch: any) => {
                                    return (
                                        <tr className="table__row" key={batch.name}
                                            data-testid={"batches-table-row"}>
                                            {/*
                                            <td className="table__cell ">
                                                {batch.interviewer}
                                            </td>
                                            */}
                                            <td className="table__cell ">
                                                {batch.questionnaire_name}
                                            </td>
                                            <td className="table__cell ">
                                                {batch.serial_number}
                                            </td>
                                            <td className="table__cell ">
                                                {batch.call_start_time}
                                            </td>
                                            <td className="table__cell ">
                                                {batch.dial_secs}
                                            </td>
                                            <td className="table__cell ">
                                                {batch.number_of_interviews}
                                            </td>
                                            <td className="table__cell ">
                                                {batch.call_result}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                        :
                        <ONSPanel>{listError}</ONSPanel>
                }
            </ErrorBoundary>

        </>
    );
}

export default InterviewerCallHistory;
