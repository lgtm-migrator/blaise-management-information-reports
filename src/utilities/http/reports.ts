import {requestPromiseJson} from "./requestPromise";

function convertSecondsToMinutesAndSeconds(seconds: any){
    const convertedMinutes = ("0" + Math.floor(seconds / 60)).slice(-2);
    const convertedSeconds = ("0" + (seconds - Math.floor(seconds / 60) * 60)).slice(-2);
    return convertedMinutes + ":" + convertedSeconds;
}

type getReportResponse = [boolean, any[]]

function getInterviewerCallHistoryReport(form: any): Promise<getReportResponse> {
    const url = "/api/reports/interviewer-call-history";
    const formData = new FormData();
    formData.append("interviewer", form.interviewer);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    return new Promise((resolve: (object: getReportResponse) => void) => {
        requestPromiseJson("POST", url, formData).then(([status, data]) => {
            console.log(`Response: Status ${status}, data ${data}`);
            if (status === 200) {
                resolve([true, data]);
            } else {
                resolve([false, []]);
            }
        }).catch((error: Error) => {
            console.error(`Response: Error ${error}`);
            resolve([false, []]);
        });
    });
}

type getReportStatusResponse = [boolean, any]

function getInterviewerCallHistoryStatus(): Promise<getReportStatusResponse> {
    const url = "/api/reports/call-history-status";
    return new Promise((resolve: (object: getReportStatusResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response: Status ${status}, data ${data}`);
            if (status === 200) {
                resolve([true, data]);
            } else {
                resolve([false, {}]);
            }
        }).catch((error: Error) => {
            console.error(`Response: Error ${error}`);
            resolve([false, {}]);
        });
    });
}

export {convertSecondsToMinutesAndSeconds, getInterviewerCallHistoryReport, getInterviewerCallHistoryStatus};
