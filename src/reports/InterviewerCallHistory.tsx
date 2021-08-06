import React, {ReactElement, useState} from "react";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../components/Form/TextInput";
import Form from "../components/Form";
import {requiredValidator} from "../components/Form/FormValidators";
import {getInterviewerCallHistoryReport} from "../utilities/HTTP";
import {convertSecondsToMinutesAndSeconds} from "../utilities/Converters";
import {InterviewerCallHistoryReportData} from "../interfaces";
import {ErrorBoundary} from "../components/ErrorHandling/ErrorBoundary";
import {ONSDateInput} from "../components/ONSDesignSystem/ONSDateInput";
import {CSVLink} from "react-csv";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Breadcrumbs from "../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "../components/CallHistoryLastUpdatedStatus";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function InterviewerCallHistory(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [message, setMessage] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<InterviewerCallHistoryReportData[]>([]);
    const reportExportHeaders = [
        {label: "Interviewer", key: "interviewer"},
        {label: "Questionnaire", key: "questionnaire_name"},
        {label: "Serial Number", key: "serial_number"},
        {label: "Call Start Time", key: "call_start_time"},
        {label: "Call Length (Seconds)", key: "dial_secs"},
        {label: "Interviews", key: "number_of_interviews"},
        {label: "Call Result", key: "call_result"}
    ];

    async function runInterviewerCallHistoryReport(formData: any) {
        setMessageNoData("");
        setReportData([]);
        setButtonLoading(true);
        console.log(formData);
        setInterviewerID(formData.interviewer);
        formData.start_date = startDate;
        formData.end_date = endDate;

        const [success, data] = await getInterviewerCallHistoryReport(formData);
        setButtonLoading(false);

        if (!success) {
            setMessage("Error running report");
            return;
        }

        if (data.length == 0) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        console.log(data);
        setReportData(data);
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{link: "/", title: "Back"}]}/>
            <main id="main-content" className="page__main u-mt-s">
                <h1 className="u-mb-m">Run interviewer call history report</h1>
                <ONSPanel hidden={(message === "")} status="error">
                    {message}
                </ONSPanel>
                <CallHistoryLastUpdatedStatus/>
                <Form onSubmit={(data) => runInterviewerCallHistoryReport(data)}>
                    <p>
                        <FormTextInput
                            name="interviewer"
                            validators={[requiredValidator]}
                            label={"Interviewer ID"}
                        />
                    </p>
                    <ONSDateInput
                        label={"Start Date"}
                        date={startDate}
                        id={"start-date"}
                        onChange={(date) => setStartDate(date)}
                    />
                    <br/>
                    <ONSDateInput
                        label={"End Date"}
                        date={endDate}
                        id={"end-date"}
                        onChange={(date) => setEndDate(date)}
                    />
                    <br/>
                    <br/>
                    <ONSButton
                        testid={"submit-call-history-Form"}
                        label={"Run"}
                        primary={true}
                        loading={buttonLoading}
                        submit={true}/>
                </Form>
                <br/>

                <CSVLink hidden={reportData === null || reportData.length === 0}
                         data={reportData}
                         headers={reportExportHeaders}
                         target="_blank"
                         filename={`interviewer-call-history-${interviewerID}`}>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>

                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        reportData && reportData.length > 0
                            ?
                            <table id="report-table" className="table u-mt-s">
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
                                    reportData.map((data: InterviewerCallHistoryReportData) => {
                                        return (
                                            <tr className="table__row" key={data.call_start_time}
                                                data-testid={"report-table-row"}>
                                                {/*
                                            <td className="table__cell ">
                                                {data.interviewer}
                                            </td>
                                            */}
                                                <td className="table__cell ">
                                                    {data.questionnaire_name}
                                                </td>
                                                <td className="table__cell ">
                                                    {data.serial_number}
                                                </td>
                                                <td className="table__cell ">
                                                    {dateFormatter(data.call_start_time).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss")}
                                                </td>
                                                <td className="table__cell ">
                                                    {convertSecondsToMinutesAndSeconds(data.dial_secs)}
                                                </td>
                                                <td className="table__cell ">
                                                    {data.number_of_interviews}
                                                </td>
                                                <td className="table__cell ">
                                                    {(data.call_result === null ? "Unknown" : data.call_result)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                            :
                            <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                    }
                    <br/>
                </ErrorBoundary>
            </main>
        </>
    );
}

export default InterviewerCallHistory;
