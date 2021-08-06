import {defineFeature, loadFeature} from "jest-cucumber";
import {createMemoryHistory} from "history";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {Router} from "react-router-dom";
import App from "../../App";
import React from "react";
import {fireEvent} from "@testing-library/dom";
import {act} from "react-dom/test-utils";
import flushPromises, {mock_fetch_requests} from "../../tests/utilities";
import {AppointmentResourcePlanningReportData} from "../../interfaces";

const feature = loadFeature(
    "./src/features/run_and_view_appointment_resource_planning_report.feature",
    {tagFilter: "not @server and not @integration"}
);

const reportDataReturned: AppointmentResourcePlanningReportData[] = [
    {
        questionnaire_name: "LMS2101_AA1",
        appointment_time: "10:00",
        appointment_language: "English",
        total: 42
    },
    {
        questionnaire_name: "LMS2101_BB1",
        appointment_time: "12:30",
        appointment_language: "Welsh",
        total: 1908
    },
    {
        questionnaire_name: "LMS2101_CC1",
        appointment_time: "15:15",
        appointment_language: "Other",
        total: 408
    }
];

const mock_server_response = () => {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(reportDataReturned),
    });
};

defineFeature(feature, test => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        cleanup();
    });
    beforeEach(() => {
        cleanup();
        mock_fetch_requests(mock_server_response);
    });
    test("Get information on appointments", ({given, when, then, and}) => {
        given("a date is provided", async () => {
            const history = createMemoryHistory();
            render(
                <Router history={history}>
                    <App/>
                </Router>
            );
            fireEvent.click(screen.getByText("Appointment resource planning"));
            await act(async () => {
                await flushPromises();
            });
            fireEvent.input(screen.getByLabelText(/Date/i), {
                target: {
                    value:
                        "01/01/2021"
                }
            });
        });
        when("I request information on appointments scheduled for that date", async () => {
            await fireEvent.click(screen.getByTestId(/submit-form-button/i));
            await act(async () => {
                await flushPromises();
            });
        });
        then("I will receive a list of the following information for appointments made:", async (docString) => {
            await waitFor(() => {
            expect(screen.getByText("Questionnaire")).toBeDefined();
            expect(screen.getByText("Appointment Time")).toBeDefined();
            expect(screen.getByText("Appointment Language")).toBeDefined();
            expect(screen.getByText("Total")).toBeDefined();
            expect(screen.getByText("LMS2101_AA1")).toBeDefined();
            expect(screen.getByText("10:00")).toBeDefined();
            expect(screen.getByText("English")).toBeDefined();
            expect(screen.getByText("42")).toBeDefined();
            expect(screen.getByText("LMS2101_BB1")).toBeDefined();
            expect(screen.getByText("12:30")).toBeDefined();
            expect(screen.getByText("Welsh")).toBeDefined();
            expect(screen.getByText("1908")).toBeDefined();
            expect(screen.getByText("LMS2101_CC1")).toBeDefined();
            expect(screen.getByText("15:15")).toBeDefined();
            expect(screen.getByText("Other")).toBeDefined();
            expect(screen.getByText("408")).toBeDefined();
            });
        });
        and("the information will be displayed in time intervals of quarter of an hour, e.g. 09:00, 09:15, 09:30, 09:45, 10:00, 10:15, etc.", async (docString) => {
            expect(screen.getByText("10:00")).toBeDefined();
            expect(screen.getByText("12:30")).toBeDefined();
            expect(screen.getByText("15:15")).toBeDefined();
        });
    });
});
