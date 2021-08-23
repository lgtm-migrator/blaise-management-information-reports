import {defineFeature, loadFeature} from "jest-cucumber";
import {createMemoryHistory} from "history";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {Router} from "react-router-dom";
import App from "../../App";
import React from "react";
import {fireEvent} from "@testing-library/dom";
import {act} from "react-dom/test-utils";
import flushPromises, {mock_fetch_requests} from "../../tests/utilities";
import {InterviewerCallHistoryReportData} from "../../interfaces";

const feature = loadFeature(
    "./src/features/run_and_view_interviewer_call_history_report.feature",
    {tagFilter: "not @server and not @integration"}
);

const reportDataReturned: InterviewerCallHistoryReportData[] = [

    {
        questionnaire_name: "LMS2101_AA1",
        serial_number: "1337",
        call_start_time: "Sat, 01 May 2021 10:00:00 GMT",
        dial_secs: "61",
        number_of_interviews: "42",
        call_result: "Busy",
    }];

const mock_server_responses = (url: string) => {
    console.log(url);
    if (url.includes("/api/reports/interviewer-call-history")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(reportDataReturned),
        });
    } else if (url.includes("/api/reports/call-history-status")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({"last_updated": "Fri, 28 May 2021 10:00:00 GMT"}),
        });
    }
};

defineFeature(feature, test => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        cleanup();
    });

    beforeEach(() => {
        cleanup();
        mock_fetch_requests(mock_server_responses);
    });

    test("Run and view interviewer call history report", ({given, when, then}) => {
        given("An interviewer ID and time period (start date and end date) has been specified", async () => {
            const history = createMemoryHistory();
            render(
                <Router history={history}>
                    <App/>
                </Router>
            );

            fireEvent.click(screen.getByText("Interviewer call history"));

            await act(async () => {
                await flushPromises();
            });

            fireEvent.click(screen.getByText("LMS"));

            fireEvent.input(screen.getByLabelText(/Interviewer ID/i), {
                target: {
                    value:
                        "ricer"
                }
            });

        });

        when("I request information on call history for that interviewer within the time specified period", async () => {

            await fireEvent.click(screen.getByTestId(/submit-button/i));

            await act(async () => {
                await flushPromises();
            });

        });

        then("I will receive a list of the following information relating to that interviewer for each call worked on, during the time period specified:", async (docString) => {
            await waitFor(() => {
                expect(screen.getByText(/LMS2101_AA1/)).toBeDefined();
                expect(screen.getByText(/1337/)).toBeDefined();
                expect(screen.getByText("01/05/2021 11:00:00")).toBeDefined();
                expect(screen.getByText(/01:01/)).toBeDefined();
                expect(screen.getByText(/42/)).toBeDefined();
                expect(screen.getByText(/Busy/)).toBeDefined();

            });
        });
    });
});
