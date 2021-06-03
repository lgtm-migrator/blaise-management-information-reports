import React, {ReactElement, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";
import {
    convertSecondsToMinutesAndSeconds,
    getInterviewerCallHistoryReport,
    getInterviewerCallHistoryStatus
} from "../utilities/http";
import {ReportData} from "../interfaces";
import {ErrorBoundary} from "../components/ErrorHandling/ErrorBoundary";
import {ONSDateInput} from "../components/ONSDesignSystem/ONSDateInput";
import dateFormatter from "dayjs";

function InterviewerCallHistory(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [message, setMessage] = useState<string>("");
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [reportStatus, setReportStatus] = useState<Date | null>(null);

    async function runInterviewerCallHistoryReport(formData: any) {
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

        console.log(data);
        setReportData(data);
    }

    useEffect(() => {
        getInterviewerCallHistoryStatus().then(([success, last_updated]) => {
            if (!success) {
                return;
            }
            setReportStatus(new Date(last_updated.last_updated));
        });
    }, []);

    return (
        <>
            <p className="u-mt-m">
                <Link to={"/"}>Previous</Link>
            </p>
            <h1>Run interviewer call history report</h1>
            <ONSPanel hidden={(message === "")} status="error">
                {message}
            </ONSPanel>
            <p className="u-fs-s">{(reportStatus && "Report data last updated: " + dateFormatter(reportStatus).format("DD/MM/YYYY HH:mm:ss"))}</p>
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
                    onChange={(date) => setStartDate(date)}
                />
                <br/>
                <ONSDateInput
                    label={"End Date"}
                    date={endDate}
                    onChange={(date) => setEndDate(date)}
                />
                <br/>
                <br/>
                <ONSButton
                    label={"Run"}
                    primary={true}
                    loading={buttonLoading}
                    submit={true}/>
            </Form>
            <br/>
            <ErrorBoundary errorMessageText={"Failed to load"}>
                {
                    reportData && reportData.length > 0
                        ?
                        <table id="report-table" className="table ">
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
                                reportData.map((data: any) => {
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
                                                {dateFormatter(data.call_start_time).format("YYYY-MM-DD HH:mm:ss")}
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
                        <br/>
                }
            </ErrorBoundary>

        </>
    );
}

export default InterviewerCallHistory;
