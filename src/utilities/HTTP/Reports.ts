import axios, { AxiosResponse } from "axios";
import { CallHistoryStatus, InterviewerCallHistoryReport, InterviewerCallPatternReport } from "../../interfaces";
import { requestPromiseJson } from "./RequestPromise";


async function getInterviewerCallHistoryStatus(): Promise<CallHistoryStatus | undefined> {
    const url = "/api/reports/call-history-status";

    return axios.get(url).then((response: AxiosResponse) => {
        console.log(`Response: Status ${response.status}, data ${response.data}`);
        if (response.status === 200) {
            return response.data;
        }
        return undefined;
    }).catch((error: Error) => {
        console.error(`Response: Error ${error}`);
        return undefined;
    });
}


function getInterviewerCallHistoryReport(form: Record<string, any>): Promise<InterviewerCallHistoryReport[]> {
    const url = "/api/reports/interviewer-call-history";
    const formData = new FormData();
    formData.append("survey_tla", form.survey_tla);
    formData.append("interviewer", form.interviewer);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);

    return axios.post(url, formData).then((response: AxiosResponse) => {
        console.log(`Response: Status ${response.status}, data ${response.data}`);
        if (response.status === 200) {
            return response.data;
        }
        return [];
    }).catch((error: Error) => {
        console.error(`Response: Error ${error}`);
        throw error;
    });
}

async function getInterviewerCallPatternReport(form: Record<string, any>): Promise<InterviewerCallPatternReport | undefined> {
    const url = "/api/reports/interviewer-call-pattern";
    const formData = new FormData();
    formData.append("survey_tla", form.survey_tla);
    formData.append("interviewer", form.interviewer);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);

    return axios.post(url, formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
        return undefined;
    }).catch((error: Error) => {
        console.error(`Response: Error ${error}`);
        throw error;
    });
}

type getAppointmentResourcePlanningReport = [boolean, any[]]

function getAppointmentResourcePlanningReport(date: string): Promise<getAppointmentResourcePlanningReport> {
    const url = "/api/reports/appointment-resource-planning";
    const formData = new FormData();
    formData.append("date", date);
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

function getAppointmentResourcePlanningSummaryReport(date: string): Promise<getAppointmentResourcePlanningSummaryReport> {
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

export { getInterviewerCallHistoryStatus, getInterviewerCallHistoryReport, getInterviewerCallPatternReport, getAppointmentResourcePlanningReport, getAppointmentResourcePlanningSummaryReport };
