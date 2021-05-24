import {requestPromiseJson} from "./requestPromise";

type getReportResponse = [boolean, any[]]

async function getReport(formData: any) {

    const url = "/api/reports/interviewer-call-history";

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
