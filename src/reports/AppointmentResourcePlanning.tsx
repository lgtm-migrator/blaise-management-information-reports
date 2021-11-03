import React, {ReactElement, useState} from "react";
import {ErrorBoundary, ONSPanel, StyledForm} from "blaise-design-system-react-components";
import {getAppointmentResourcePlanningReport, getAppointmentResourcePlanningSummaryReport} from "../utilities/HTTP";
import {AppointmentResourcePlanningReportData, AppointmentResourcePlanningSummaryReportData} from "../interfaces";
import {CSVLink} from "react-csv";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Breadcrumbs from "../components/Breadcrumbs";
import ReportErrorPanel from "../components/ReportErrorPanel";
import AppointmentSummary from "./AppointmentSummary";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function AppointmentResourcePlanning(): ReactElement {
    const [reportFailed, setReportFailed] = useState<boolean>(false);
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportDate, setReportDate] = useState<string>("");
    const [reportData, setReportData] = useState<AppointmentResourcePlanningReportData[]>([]);
    const [summaryFailed, setSummaryFailed] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<AppointmentResourcePlanningSummaryReportData[]>([]);

    const reportExportHeaders = [
        {label: "Questionnaire", key: "questionnaire_name"},
        {label: "Appointment Time", key: "appointment_time"},
        {label: "Appointment Language", key: "appointment_language"},
        {label: "Total", key: "total"}
    ];


    function runReport(formValues: any, setSubmitting: (isSubmitting: boolean) => void): void {
        runAppointmentResourcePlanningReport(formValues["date"], setSubmitting);
        runAppointmentSummary(formValues["date"]);
    }

    function runAppointmentResourcePlanningReport(date: string, setSubmitting: (isSubmitting: boolean) => void): void {
        setMessageNoData("");
        setReportData([]);
        setReportFailed(false);
        setReportDate(date);

        getAppointmentResourcePlanningReport(date)
            .then(([success, data]) => {
                setSubmitting(false);
                if (!success) {
                    setReportFailed(true);
                    return;
                }

                if (data.length == 0) {
                    setMessageNoData("No data found for parameters given.");
                    return;
                }

                console.log(data);
                setReportData(data);
            });
    }

    function runAppointmentSummary(date: string): void {
        setSummaryData([]);
        setSummaryFailed(false);

        getAppointmentResourcePlanningSummaryReport(date)
            .then(([success, data]) => {
                if (!success) {
                    setSummaryFailed(true);
                    return;
                }

                console.log(data);
                setSummaryData(data);
            });
    }

    const fields = [
        {
            name: "date",
            type: "date",
            initial_value: dateFormatter(new Date()).format("YYYY-MM-DD")
        }
    ];

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{link: "/", title: "Back"}]}/>
            <main id="main-content" className="page__main u-mt-s">
                <h1 className="u-mb-m">Run appointment resource planning report</h1>

                <ONSPanel>
                    <p>
                        Run a Daybatch first to obtain the most accurate results.
                    </p>
                    <p>
                        Appointments that have already been attempted will not be displayed.
                    </p>
                </ONSPanel>

                <ReportErrorPanel error={reportFailed}/>
                <div className="u-mt-s">
                    <StyledForm fields={fields}
                                onSubmitFunction={runReport}
                                submitLabel={"Run"}/>
                </div>

                <AppointmentSummary data={summaryData} failed={summaryFailed}/>

                <div className=" u-mt-m">
                    <CSVLink hidden={reportData === null || reportData.length === 0}
                             data={reportData}
                             headers={reportExportHeaders}
                             target="_blank"
                             filename={`appointment-resource-planning-report-${reportDate}.csv`}>
                        Export report as Comma-Separated Values (CSV) file
                    </CSVLink>
                </div>
                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        reportData && reportData.length > 0
                            ?
                            <table id="report-table" className="table elementToFadeIn u-mt-s">
                                <thead className="table__head u-mt-m">
                                <tr className="table__row">
                                    <th scope="col" className="table__header ">
                                        <span>Questionnaire</span>
                                    </th>
                                    <th scope="col" className="table__header ">
                                        <span>Appointment Time</span>
                                    </th>
                                    <th scope="col" className="table__header ">
                                        <span>Appointment Language</span>
                                    </th>
                                    <th scope="col" className="table__header ">
                                        <span>Total</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="table__body">
                                {
                                    reportData.map((data: AppointmentResourcePlanningReportData) => {
                                        return (
                                            <tr className="table__row"
                                                key={`${data.questionnaire_name}-${data.appointment_time}-${data.appointment_language}`}
                                                data-testid={"report-table-row"}>
                                                <td className="table__cell ">
                                                    {data.questionnaire_name}
                                                </td>
                                                <td className="table__cell ">
                                                    {data.appointment_time}
                                                </td>
                                                <td className="table__cell ">
                                                    {data.appointment_language}
                                                </td>
                                                <td className="table__cell ">
                                                    {data.total}
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

export default AppointmentResourcePlanning;
