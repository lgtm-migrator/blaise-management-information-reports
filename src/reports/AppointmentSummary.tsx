import React, {ReactElement, useState, useEffect} from "react";
import {getAppointmentResourcePlanningSummaryReport} from "../utilities/HTTP";
import {AppointmentResourcePlanningSummaryReportData} from "../interfaces";

interface Props {
    date: string
    formSubmitting: boolean
}

const AppointmentSummary = ({date, formSubmitting}: Props): ReactElement => {
    const [summaryFailed, setSummaryFailed] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<AppointmentResourcePlanningSummaryReportData[]>([]);

    useEffect(() => {
        if (formSubmitting) {
            runAppointmentResourcePlanningSummaryReport();
        }
    }, [formSubmitting, date]);

    async function runAppointmentResourcePlanningSummaryReport(): Promise<void> {
        setSummaryData([]);
        setSummaryFailed(false);

        const [success, data] = await getAppointmentResourcePlanningSummaryReport(date);

        if (!success) {
            setSummaryFailed(true);
            return;
        }

        console.log(data);
        setSummaryData(data);
    }

    if (summaryFailed) {
        return <p className="u-mt-m">Failed to get appointment language summary</p>;
    }

    if (summaryData.length === 0) {
        return <></>;
    }

    return (
        <div>
            <div className="summary u-mb-m elementToFadeIn u-mt-m">
                <div className="summary__group">
                    <h2 className="summary__group-title">Appointment language summary</h2>
                    <table className="summary__items">
                        <thead className="u-vh">
                        <tr>
                            <th>Language</th>
                            <th>Total appointments</th>
                        </tr>
                        </thead>
                        <tbody className="summary__item">
                        {
                            summaryData.map(({language, total}: AppointmentResourcePlanningSummaryReportData) => {
                                return (
                                    <tr className="summary__row summary__row--has-values" key={language}
                                        data-testid={"summary-table-row"}>
                                        <td className="summary__item-title">
                                            <div className="summary__item--text">
                                                {language}
                                            </div>
                                        </td>
                                        <td className="summary__values">
                                            {total}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSummary;
