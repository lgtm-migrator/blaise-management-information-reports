import React, { ReactElement } from "react";
import { ONSPanel } from "blaise-design-system-react-components";
import { AppointmentResourcePlanningSummaryReportData } from "../../interfaces";

interface Props {
    data: AppointmentResourcePlanningSummaryReportData[];
    failed: boolean;
}

const AppointmentSummary = ({ data, failed }: Props): ReactElement => {
    if (failed) {
        return <ONSPanel status="error"><p>Failed to get appointment language summary</p></ONSPanel>;
    }

    if (data.length === 0) {
        return <></>;
    }

    return (
        <div>
            <div className="summary u-mb-m elementToFadeIn u-mt-m">
                <div className="summary__group">
                    <h2 className="summary__group-title">Appointment language summary</h2>
                    <table className="summary__items u-mt-s">
                        <thead className="u-vh">
                            <tr>
                                <th>Language</th>
                                <th>Total appointments</th>
                            </tr>
                        </thead>
                        {
                            data.map(({ language, total }: AppointmentResourcePlanningSummaryReportData) => (
                                <tbody className="summary__item" key={language}>
                                    <tr
                                        className="summary__row summary__row--has-values"
                                        data-testid="summary-table-row"
                                    >
                                        <td className="summary__item-title">
                                            <div className="summary__item--text">
                                                {language}
                                            </div>
                                        </td>
                                        <td className="summary__values">
                                            {total}
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        }
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSummary;
