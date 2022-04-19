import React, { ReactElement, useState } from "react";
import { ONSPanel, StyledForm } from "blaise-design-system-react-components";
import { getAppointmentResourcePlanningReport, getAppointmentResourcePlanningSummaryReport } from "../../utilities/HTTP";
import { AppointmentResourcePlanningReportData, AppointmentResourcePlanningSummaryReportData } from "../../interfaces";
import { CSVLink } from "react-csv";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Breadcrumbs from "../../components/Breadcrumbs";
import ReportErrorPanel from "../../components/ReportErrorPanel";
import AppointmentSummary from "./AppointmentSummary";
import { AppointmentResults } from "./AppointmentResults";
import SurveyDateForm from "../../components/SurveyDateForm";

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
        { label: "Questionnaire", key: "questionnaire_name" },
        { label: "Appointment Time", key: "appointment_time" },
        { label: "Appointment Language", key: "appointment_language" },
        { label: "Total", key: "total" }
    ];


    function runReport(form: Record<string, any>, setSubmitting: (isSubmitting: boolean) => void): void {
        form.survey_tla = form["Survey TLA"];
        form.date = new Date(form["Date"]);

        runAppointmentResourcePlanningReport(form, setSubmitting);
        runAppointmentSummary(form);
    }

    function runAppointmentResourcePlanningReport(form: Record<string, any>, setSubmitting: (isSubmitting: boolean) => void): void {
        setMessageNoData("");
        setReportData([]);
        setReportFailed(false);
        setReportDate(form.date);

        getAppointmentResourcePlanningReport(form.date, form.survey_tla).then((planningReport: AppointmentResourcePlanningReportData[]) => {
            if (planningReport.length === 0) {
                setMessageNoData("No data found for parameters given.");
            }

            console.log(planningReport);
            setReportData(planningReport);
        }).catch(() => {
            setReportFailed(true);
            return;
        }).finally(() => {
            setSubmitting(false);
        });

    }

    function runAppointmentSummary(form: Record<string, any>): void {
        setSummaryData([]);
        setSummaryFailed(false);
        getAppointmentResourcePlanningSummaryReport(form.date, form.survey_tla)
            .then((summaryReport: AppointmentResourcePlanningSummaryReportData[]) => {
                console.log(summaryReport);
                setSummaryData(summaryReport);
            }).catch(() => {
                setSummaryFailed(true);
            });
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{ link: "/", title: "Back" }]} />
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

                <ReportErrorPanel error={reportFailed} />
                <br/>
                <SurveyDateForm onSubmitFunction={runReport} />
                <AppointmentSummary data={summaryData} failed={summaryFailed} />

                <div className=" u-mt-m">
                    <CSVLink hidden={reportData === null || reportData.length === 0}
                        data={reportData}
                        headers={reportExportHeaders}
                        target="_blank"
                        filename={`appointment-resource-planning-report-${reportDate}.csv`}>
                        Export report as Comma-Separated Values (CSV) file
                    </CSVLink>
                </div>
                <AppointmentResults reportData={reportData} messageNoData={messageNoData} />
            </main>
        </>
    );
}

export default AppointmentResourcePlanning;
