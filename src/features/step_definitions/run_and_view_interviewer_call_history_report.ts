import {defineFeature, loadFeature} from "jest-cucumber";
import {createMemoryHistory} from "history";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {Router} from 'react-router-dom'
import App from "../../App";

const feature = loadFeature(
    "./src/features/run_and_view_interviewer_call_history_report.feature",
    {tagFilter: "not @server and not @integration"}
);

defineFeature(feature, test => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        cleanup();
    });

    beforeEach(() => {
        cleanup();
    });

    test("Run and view interviewer call history report", ({given, when, then}) => {
        given("An interviewer ID and time period (start date and end date) has been specified", async () => {
            const history = createMemoryHistory()
        });

        when("I request information on call history for that interviewer within the time specified period", async () => {
            expect(screen.getByText(/Management Information Reports/i)).toBeDefined();
        });

        then("I will receive a list of the following information relating to that interviewer for each call worked on," +
            "during the time period specified:" +
            " * Questionnaire" +
            " * Serial Number" +
            " * Call Start Time" +
            " * Call Length" +
            " * Interviews" +
            " * Call Result", async () => {
            await waitFor((() => {
                expect(screen.getByText(/Management Information Reports/i)).toBeDefined();
            }));
        });
    });
});
