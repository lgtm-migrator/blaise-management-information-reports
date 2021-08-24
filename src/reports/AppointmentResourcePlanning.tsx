import React, {ReactElement, useState} from "react";
import {ErrorBoundary, ONSPanel, StyledForm} from "blaise-design-system-react-components";
import {getAppointmentResourcePlanningReport} from "../utilities/HTTP";
import {AppointmentResourcePlanningReportData} from "../interfaces";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Breadcrumbs from "../components/Breadcrumbs";
import ReportErrorPanel from "../components/ReportErrorPanel";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function AppointmentResourcePlanning(): ReactElement {
    const [reportFailed, setReportFailed] = useState<boolean>(false);
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<AppointmentResourcePlanningReportData[]>([]);

    async function runAppointmentResourcePlanningReport(formValues: any, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        setMessageNoData("");
        setReportData([]);
        setReportFailed(false);
        console.log(formValues);

        const [success, data] = await getAppointmentResourcePlanningReport(formValues);
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
                <ReportErrorPanel error={reportFailed}/>
                <div className="u-mt-s">
                    <StyledForm fields={fields} onSubmitFunction={runAppointmentResourcePlanningReport}
                                submitLabel={"Run"}/>
                </div>

                <br/>

                <ErrorBoundary errorMessageText={"Failed to load"}>
                    {
                        reportData && reportData.length > 0
                            ?
                            <table id="report-table" className="table u-mt-s">
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
                                        <span>Call Result</span>
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
                                            <tr className="table__row" key={data.questionnaire_name}
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
                                                    {data.dial_result}
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
