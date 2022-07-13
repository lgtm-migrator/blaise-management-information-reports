import React, {ReactElement, useEffect, useState} from "react";
import TimeAgo from "react-timeago";
import dateFormatter from "dayjs";
import {getInterviewerCallHistoryStatus} from "../utilities/HTTP";
import {CallHistoryStatus} from "../interfaces";

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

    const ReportStatusText = () => {
        if (reportStatusFailed) {
            return (<>Unknown</>);
        }
        return (
            <>
                {<TimeAgo live={false} date={reportStatus}/>}
                {(reportStatus ? "" + dateFormatter(reportStatus).tz("Europe/London").format(" (DD/MM/YYYY HH:mm:ss)") : "Loading")}
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
