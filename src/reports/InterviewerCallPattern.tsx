import React, {ReactElement, useEffect, useState} from "react";
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
import {formatText} from "../utilities/textFormatting";
import TimeAgo from "react-timeago";
import Breadcrumbs from "../components/Breadcrumbs";
import CallHistoryLastUpdatedStatus from "./CallHistoryLastUpdatedStatus";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function InterviewerCallPattern(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [interviewerID, setInterviewerID] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [message, setMessage] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<any>({});
    const [reportStatus, setReportStatus] = useState<Date | "">("");

    async function runInterviewerCallPatternReport(formData: any) {
        setMessageNoData("");
        setMessage("");
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

        if (Object.keys(data).length === 0) {
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
                <tbody className="summary__item" key={field}>
                <tr className="summary__row summary__row--has-values">
                    <td className="summary__item-title">
                        <div className="summary__item--text">
                            {formatText(field)}
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
            <Breadcrumbs BreadcrumbList={[{link: "/", title: "Back"}]}/>
            <main id="main-content" className="page__main u-mt-s">
                <h1 className="u-mb-m">Run interviewer call pattern report</h1>
                <CallHistoryLastUpdatedStatus/>
                <div className="u-mb-m">
                    <ONSPanel>
                        <p>
                            Incomplete data is removed from this report. This will impact the accuracy of the report.
                        </p>
                        <p>
                            The <b>Discounted invalid records</b> entry will advise how many records have been removed.
                        </p>
                        <p>
                            The <b>Invalid fields</b> entry will advise which fields were incomplete.
                        </p>
                    </ONSPanel>
                </div>

                <ONSPanel hidden={(message === "")} status="error">
                    {message}
                </ONSPanel>

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

                <CSVLink hidden={Object.entries(reportData).length === 0}
                         data={[reportData]}
                         target="_blank"
                         filename={`interviewer-call-pattern-${interviewerID}`}>
                    Export report as Comma-Separated Values (CSV) file
                </CSVLink>

                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        Object.entries(reportData).length > 0
                            ?
                            <div className="summary">
                                <div className="summary__group">
                                    <table id="report-table" className="summary__items u-mt-s">
                                        {
                                            convertJsonToTable(reportData)
                                        }
                                    </table>
                                </div>
                            </div>
                            :
                            <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
                    }
                    <br/>
                </ErrorBoundary>
            </main>
        </>
    );
}

export default InterviewerCallPattern;
