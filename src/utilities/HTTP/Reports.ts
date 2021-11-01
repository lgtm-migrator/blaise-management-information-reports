import {requestPromiseJson} from "./RequestPromise";

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
    formData.append("survey_tla", form.survey_tla);
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
    formData.append("survey_tla", form.survey_tla);
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

type getAppointmentResourcePlanningReport = [boolean, any[]]

function getAppointmentResourcePlanningReport(form: any): Promise<getInterviewerCallPatternReportResponse> {
    const url = "/api/reports/appointment-resource-planning";
    const formData = new FormData();
    formData.append("date", form.date);
    return new Promise((resolve: (object: getAppointmentResourcePlanningReport) => void) => {
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

type getAppointmentResourcePlanningSummaryReport = [boolean, any[]]

function getAppointmentResourcePlanningSummaryReport(date: string): Promise<getInterviewerCallPatternReportResponse> {
    const url = "/api/reports/appointment-resource-planning-summary";
    const formData = new FormData();
    formData.append("date", date);
    return new Promise((resolve: (object: getAppointmentResourcePlanningSummaryReport) => void) => {
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

export {getInterviewerCallHistoryStatus, getInterviewerCallHistoryReport, getInterviewerCallPatternReport, getAppointmentResourcePlanningReport, getAppointmentResourcePlanningSummaryReport};
