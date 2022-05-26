import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getInterviewerCallHistoryReport } from ".";
import { InterviewerCallHistoryReport } from "../../interfaces";

describe("getInterviewerCallHistoryReport", () => {
    const mockAdapter = new MockAdapter(axios);

    afterEach(() => {
        mockAdapter.reset();
    });

    it("posts the search parameters", async () => {
        expect.assertions(5);
        mockAdapter.onPost(
            "/api/reports/interviewer-call-history",
            {
                asymmetricMatch: (formData: FormData) => {
                    expect(formData.get("survey_tla")).toBe("DST");
                    expect(formData.get("interviewer")).toBe("James");
                    expect(formData.get("start_date")).toBe("2022-01-02");
                    expect(formData.get("end_date")).toBe("2022-02-05");
                    expect(formData.get("instruments")).toBe("INST1,INST2");
                    return true;
                }
            }
        ).reply(200, []);

        await getInterviewerCallHistoryReport(
            {
                survey_tla: "DST",
                interviewer: "James",
                start_date: "2022-01-02",
                end_date: "2022-02-05",
                instruments: "INST1,INST2",
            }
        );
    });

    it("posts undefined for search values when they are missing", async () => {
        // This is strange behaviour, but it's the way it is currently working.
        // Perhaps an empty string, or a property typed input would be better
        expect.assertions(5);
        mockAdapter.onPost(
            "/api/reports/interviewer-call-history",
            {
                asymmetricMatch: (formData: FormData) => {
                    expect(formData.get("survey_tla")).toBe("undefined");
                    expect(formData.get("interviewer")).toBe("undefined");
                    expect(formData.get("start_date")).toBe("undefined");
                    expect(formData.get("end_date")).toBe("undefined");
                    expect(formData.get("instruments")).toBe("undefined");
                    return true;
                }
            }
        ).reply(200, []);

        await getInterviewerCallHistoryReport({});
    });

    it("returns the instruments", async () => {
        const response: InterviewerCallHistoryReport = {
            questionnaire_name: "DST",
            serial_number: "9001",
            call_start_time: "2022-01-02 10:05:20",
        };

        mockAdapter.onPost("/api/reports/interviewer-call-history").reply(200, response);
        expect(await getInterviewerCallHistoryReport(
            {
                survey_tla: "DST",
                interviewer: "James",
                start_date: "2022-01-02",
                end_date: "2022-02-05",
                instruments: "INST1,INST2",
            }
        )).toEqual(response);
    });

    it("rejects when error status is returned", async () => {
        mockAdapter.onPost("/api/reports/interviewer-call-history").reply(500, "error");
        expect.assertions(1);
        try {
            await getInterviewerCallHistoryReport(
                {
                    survey_tla: "DST",
                    interviewer: "James",
                    start_date: "2022-01-02",
                    end_date: "2022-02-05",
                    instruments: "INST1,INST2",
                }
            );
        } catch (e) {
            expect(e.message).toBe("Request failed with status code 500");
        }
    });

    it("rejects when error status is not 200", async () => {
        mockAdapter.onPost("/api/reports/interviewer-call-history").reply(201, "error");
        expect.assertions(1);
        try {
            await getInterviewerCallHistoryReport(
                {
                    survey_tla: "DST",
                    interviewer: "James",
                    start_date: "2022-01-02",
                    end_date: "2022-02-05",
                    instruments: "INST1,INST2",
                }
            );
        } catch (e) {
            expect(e.message).toBe("Response was not 200");
        }
    });
});
