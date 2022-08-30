import { InterviewerCallHistoryReport } from "../interfaces";
import { formatDateAndTime } from "../utilities/DateFormatter";
import { convertSecondsToMinutesAndSeconds } from "../utilities/Converters";
import React, { ReactElement } from "react";
import { ONSPanel } from "blaise-design-system-react-components";

interface CallHistoryReportTableProps {
    reportData: any
    messageNoData: string
}

function callHistoryReportTable({ reportData, messageNoData }: CallHistoryReportTableProps): ReactElement{
    return (
        reportData && reportData.length > 0
            ?
            <table id="report-table" className="table u-mt-s">
                <thead className="table__head u-mt-m">
                    <tr className="table__row">
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
                            <span>Call Result</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {
                        reportData.map((callHistory: InterviewerCallHistoryReport) => {
                            return (
                                <tr className="table__row" key={callHistory.call_start_time}
                                    data-testid={"report-table-row"}>
                                    <td className="table__cell ">
                                        {callHistory.questionnaire_name}
                                    </td>
                                    <td className="table__cell ">
                                        {callHistory.serial_number}
                                    </td>
                                    <td className="table__cell ">
                                        {formatDateAndTime(callHistory.call_start_time)}
                                    </td>
                                    <td className="table__cell ">
                                        {convertSecondsToMinutesAndSeconds(callHistory.dial_secs)}
                                    </td>
                                    <td className="table__cell ">
                                        {(callHistory.call_result === null ? "Unknown" : callHistory.call_result)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            :
            <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
    );
}

export default callHistoryReportTable;
