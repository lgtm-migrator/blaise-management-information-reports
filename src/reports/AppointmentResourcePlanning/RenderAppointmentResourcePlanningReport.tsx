import React, { ReactElement, useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CSVLink } from "react-csv";
import { AppointmentResourcePlanningReportData, AppointmentResourcePlanningSummaryReportData } from "../../interfaces";
import { getAppointmentResourcePlanningReport, getAppointmentResourcePlanningSummaryReport } from "../../utilities/HTTP";
import AppointmentResourceDaybatchWarning from "./AppointmentResourceDaybatchWarning";
import ReportErrorPanel from "../../components/ReportErrorPanel";
import { AppointmentResults } from "./AppointmentResults";
import AppointmentSummary from "./AppointmentSummary";
import { formatDate } from "../../utilities/DateFormatter";

interface RenderAppointmentResourcePlanningReportPageProps {
    reportDate: Date;
    surveyTla: string;
    questionnaires: string[];
    navigateBack: () => void;
    navigateBackTwoSteps: () => void;
}

function formatList(listOfQuestionnaires: string[]): string {
    if (listOfQuestionnaires.length === 1) return listOfQuestionnaires[0];
    const firsts = listOfQuestionnaires.slice(0, listOfQuestionnaires.length - 1);
    const last = listOfQuestionnaires[listOfQuestionnaires.length - 1];
    return firsts.join(", ") + " and " + last;
}

function RenderAppointmentResourcePlanningReport(props: RenderAppointmentResourcePlanningReportPageProps): ReactElement {
    const [reportFailed, setReportFailed] = useState<boolean>(false);
    const [reportData, setReportData] = useState<AppointmentResourcePlanningReportData[]>([]);
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [summaryFailed, setSummaryFailed] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<AppointmentResourcePlanningSummaryReportData[]>([]);

    const {
        reportDate,
        surveyTla,
        questionnaires,
        navigateBack,
        navigateBackTwoSteps,
    } = props;

    const reportExportHeaders = [
        { label: "Questionnaire", key: "questionnaire_name" },
        { label: "Appointment Time", key: "appointment_time" },
        { label: "Appointment Language", key: "appointment_language" },
        { label: "Total", key: "total" }
    ];

    useEffect(() => {
        runAppointmentResourcePlanningReport();
    }, []
    );

    useEffect(() => {
        runAppointmentSummary();
    }, []
    );

    async function runAppointmentResourcePlanningReport(): Promise<void> {
        setMessageNoData("");
        setReportFailed(false);
        setReportData([]);

        let planningReport: AppointmentResourcePlanningReportData[];
        try {
            planningReport = await getAppointmentResourcePlanningReport(reportDate, surveyTla, questionnaires);
        } catch {
            setReportFailed(true);
            return;
        } finally {
            //setSubmitting(false);
        }

        if (planningReport.length === 0) {
            setMessageNoData("No data found for parameters given.");
            return;
        }

        console.log(planningReport);
        setReportData(planningReport);
    }

    async function runAppointmentSummary(): Promise<void> {
        setSummaryData([]);
        setSummaryFailed(false);
        getAppointmentResourcePlanningSummaryReport(reportDate, surveyTla, questionnaires)
            .then((summaryReport: AppointmentResourcePlanningSummaryReportData[]) => {
                console.log(summaryReport);
                setSummaryData(summaryReport);
            }).catch(() => {
                setSummaryFailed(true);
            });
    }

    return (
        <>
            <Breadcrumbs BreadcrumbList={[{ link: "/", title: "Reports" }, {
                link: "#",
                onClickFunction: navigateBackTwoSteps,
                title: "Appointment details"
            }, { link: "#", onClickFunction: navigateBack, title: "Questionnaires" }]}/>
            <main id="main-content" className="page__main u-mt-s">

                <h1 className="u-mb-m">
                    Appointment Resource Planning Report
                </h1>
                <h3 className="u-mb-m">
                    Date: {formatDate(reportDate)}<br/>
                    Questionnaire{questionnaires.length > 1 ? ("s:") : ":"} {formatList(questionnaires)}{" "}
                </h3>
                <AppointmentResourceDaybatchWarning/>

                <ReportErrorPanel error={reportFailed}/>

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
                <AppointmentResults reportData={reportData} messageNoData={messageNoData}/>
            </main>
        </>
    );
}

export default RenderAppointmentResourcePlanningReport;
