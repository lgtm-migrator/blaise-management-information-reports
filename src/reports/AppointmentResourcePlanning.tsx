import React, {ReactElement, useState} from "react";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import Form from "../components/Form";
import {getAppointmentResourcePlanningReport} from "../utilities/HTTP";
import {AppointmentResourcePlanningReportData} from "../interfaces";
import {ErrorBoundary} from "../components/ErrorHandling/ErrorBoundary";
import {ONSDateInput} from "../components/ONSDesignSystem/ONSDateInput";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Breadcrumbs from "../components/Breadcrumbs";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

function AppointmentResourcePlanning(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [message, setMessage] = useState<string>("");
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [reportData, setReportData] = useState<AppointmentResourcePlanningReportData[]>([]);

    async function runAppointmentResourcePlanningReport(formData: any) {
        setMessageNoData("");
        setReportData([]);
        setButtonLoading(true);
        console.log(formData);
        formData.date = date;

        const [success, data] = await getAppointmentResourcePlanningReport(formData);
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
                <h1 className="u-mb-m">Run appointment resource planning report</h1>
                <ONSPanel hidden={(message === "")} status="error">
                    {message}
                </ONSPanel>
                <Form onSubmit={(data) => runAppointmentResourcePlanningReport(data)}>
                    <ONSDateInput
                        label={"Date"}
                        date={date}
                        id={"date"}
                        onChange={(date) => setDate(date)}
                    />
                    <br/>
                    <br/>
                    <ONSButton
                        testid={"submit-Form"}
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
