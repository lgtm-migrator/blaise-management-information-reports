import React, {ReactElement, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";
import {getInterviewerCallHistoryStatus, getInterviewerCallPatternReport} from "../utilities/http";
import {ErrorBoundary} from "../components/ErrorHandling/ErrorBoundary";
import {ONSDateInput} from "../components/ONSDesignSystem/ONSDateInput";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {CSVLink} from "react-csv";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function InterviewerCallPattern(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [message, setMessage] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<any>([]);
    const [reportStatus, setReportStatus] = useState<Date | null>(null);

    async function runInterviewerCallPatternReport(formData: any) {
        setReportData([]);
        setButtonLoading(true);
        console.log(formData);
        setInterviewerID(formData.interviewer);
        formData.start_date = startDate;
        formData.end_date = endDate;

        const [success, data] = await getInterviewerCallPatternReport(formData);
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

    function convertJsonToTable(object: any) {
        const elementList: ReactElement[] = [];
        const entries: [string, (string | null | number)][] = Object.entries(object);
        for (const [field, data] of entries) {
            elementList.push(
                <tbody className="summary__item">
                <tr className="summary__row summary__row--has-values">
                    <td className="summary__item-title">
                        <div className="summary__item--text">
                            {field}
                        </div>
                    </td>
                    <td className="summary__values" colSpan={2}>
                        {data}
                    </td>
                </tr>
                </tbody>
            );
        }
        return elementList.map((element => {
            return element;
        }));
    }




    function convertJsonToCsv(object: any) {
        const arrData = typeof object !== "object" ? JSON.parse(object) : object;
        let CSV = "";
        let row = "";
        for (const index in arrData[0]) {
            row += index + ",";
        }
        row = row.slice(0, -1);
        CSV += row + "\r\n";
        for (let i = 0; i < arrData.length; i++) {
            let row = "";
            for (const index in arrData[i]) {
                row += "\"" + arrData[i][index] + "\",";
            }
            row.slice(0, row.length - 1);
            CSV += row + "\r\n";
        }
        return CSV;
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
            <ONSPanel>
                <p>
                    Data in this report maybe inaccurate.
                    <br/>
                    <br/>
                    Calls without end dates are disregarded.
                </p>
            </ONSPanel>
            <br/>
            <h1>Run interviewer call pattern report</h1>
            <ONSPanel hidden={(message === "")} status="error">
                {message}
            </ONSPanel>
            <p className="u-fs-s">{"Report data last updated: " + (reportStatus && "" + dateFormatter(reportStatus).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss"))}</p>
            <Form onSubmit={(data) => runInterviewerCallPatternReport(data)}>
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
                    testid={"submit-call-pattern-form"}
                    label={"Run"}
                    primary={true}
                    loading={buttonLoading}
                    submit={true}/>
            </Form>
            <br/>


            <CSVLink hidden={reportData === null}
                //data={JSON.stringify(reportData)}
                     data={convertJsonToCsv(reportData)}
                     target="_blank"
                     filename={`interviewer-call-pattern-${interviewerID}`}>
                Export report as Comma-Separated Values (CSV) file
            </CSVLink>


            <ErrorBoundary errorMessageText={"Failed to load"}>
                {
                    reportData
                        ?
                        <table id="report-table" className="table u-mt-s">
                            {
                                convertJsonToTable(reportData)
                            }
                        </table>
                        :
                        <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                }
                <br/>
            </ErrorBoundary>
        </>
    );
}

export default InterviewerCallPattern;
