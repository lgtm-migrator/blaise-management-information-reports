import React, { ReactElement, useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import { getInterviewerCallHistoryStatus } from "../utilities/HTTP";
import { CallHistoryStatus } from "../interfaces";
import { mirBstDateFormatter } from "../utilities/DateFormatter";

const CallHistoryLastUpdatedStatus = (): ReactElement => {
    const [reportStatus, setReportStatus] = useState<Date | "">("");
    const [reportStatusFailed, setReportStatusFailed] = useState<boolean>(false);

    useEffect(() => {
        getInterviewerCallHistoryStatus().then((callHistoryStatus: CallHistoryStatus | undefined) => {
            if (!callHistoryStatus) {
                setReportStatusFailed(true);
                return;
            }
            setReportStatus(new Date(callHistoryStatus.last_updated));
        });
    }, []);

    const DisplayResult = () => {
        const date = mirBstDateFormatter(reportStatus, true);
        if (date == "Invalid Date") {
            return date;
        }
        return ` (${date})`;
    };

    const ReportStatusText = () => {
        if (reportStatusFailed) {
            return (<>Unknown</>);
        }
        return (
            <>
                {<TimeAgo live={false} date={reportStatus}/>}
                {(reportStatus ?
                    DisplayResult() :
                    "Loading")}
            </>
        );
    };

    return (
        <>
            <p className="u-fs-s u-mt-s" aria-live="polite">
                Data in this report was last updated: <b>
                    <ReportStatusText/>
                </b>
            </p>
            <p className="u-fs-s">
                Data in this report only goes back to the last 12 months.
            </p>
        </>
    );
};

export default CallHistoryLastUpdatedStatus;
