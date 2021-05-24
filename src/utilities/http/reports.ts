import {requestPromiseJson} from "./requestPromise";

type getReportResponse = [boolean, any[]]

function getReport(form: any) {

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

export {getReport};
