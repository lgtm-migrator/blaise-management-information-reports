import {requestPromiseJson} from "./requestPromise";

type getInterviewerCallHistoryStatusResponse = [boolean, any]

function getInterviewerCallHistoryStatus(): Promise<getInterviewerCallHistoryStatusResponse> {
    const url = "/api/reports/call-history-status";
    return new Promise((resolve: (object: getInterviewerCallHistoryStatusResponse) => void) => {
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

type getInterviewerCallHistoryReportResponse = [boolean, any[]]

function getInterviewerCallHistoryReport(form: any): Promise<getInterviewerCallHistoryReportResponse> {
    const url = "/api/reports/interviewer-call-history";
    const formData = new FormData();
    formData.append("interviewer", form.interviewer);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    return new Promise((resolve: (object: getInterviewerCallHistoryReportResponse) => void) => {
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

type getInterviewerCallPatternReportResponse = [boolean, any[]]

function getInterviewerCallPatternReport(form: any): Promise<getInterviewerCallPatternReportResponse> {
    const url = "/api/reports/interviewer-call-pattern";
    const formData = new FormData();
    formData.append("interviewer", form.interviewer);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    return new Promise((resolve: (object: getInterviewerCallPatternReportResponse) => void) => {
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

export {getInterviewerCallHistoryStatus, getInterviewerCallHistoryReport, getInterviewerCallPatternReport};
