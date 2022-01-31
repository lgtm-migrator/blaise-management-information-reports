import { defineFeature, loadFeature } from "jest-cucumber";
import { createMemoryHistory } from "history";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import App from "../../App";
import React from "react";
import { fireEvent } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import flushPromises, { mock_fetch_requests } from "../../tests/utilities";
import { AppointmentResourcePlanningReportData } from "../../interfaces";

const feature = loadFeature(
    "./src/features/run_and_view_appointment_resource_planning_report.feature",
    { tagFilter: "not @server and not @integration" }
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

const ReportSummary = [
    { language: "English", total: 1 },
    { language: "Welsh", total: 1 },
    { language: "Other", total: 1 },
];

const mock_server_response = (url: string) => {
    if (url.includes("/api/reports/appointment-resource-planning-summary")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(ReportSummary),
        });
    }
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
        localStorage.setItem("token", JSON.stringify({ "role": "test" }));
        mock_fetch_requests(mock_server_response);
    });
    test("Get information on appointments", ({ given, when, then, and }) => {
        given("a date is provided", async () => {
            const history = createMemoryHistory();
            render(
                <Router history={history}>
                    <App />
                </Router>
            );
            fireEvent.click(screen.getByText("Appointment resource planning"));
            await act(async () => {
                await flushPromises();
            });
            fireEvent.input(screen.getByLabelText(/Date/i), {
                target: {
                    value:
                        "2021-01-01"
                }
            });
        });
        when("I request information on appointments scheduled for that date", async () => {
            await fireEvent.click(screen.getByTestId(/submit-button/i));
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

                const list = screen.queryAllByTestId(/report-table-row/i);
                const listItemOne = list[0].textContent;
                expect(listItemOne).toEqual("LMS2101_AA110:00English42");
                const listItemTwo = list[1].textContent;
                expect(listItemTwo).toEqual("LMS2101_BB112:30Welsh1908");
                const listItemThree = list[2].textContent;
                expect(listItemThree).toEqual("LMS2101_CC115:15Other408");
            });
        });
        and("the information will be displayed in time intervals of quarter of an hour, e.g. 09:00, 09:15, 09:30, 09:45, 10:00, 10:15, etc.", async (docString) => {
            expect(screen.getByText("10:00")).toBeDefined();
            expect(screen.getByText("12:30")).toBeDefined();
            expect(screen.getByText("15:15")).toBeDefined();
        });
    });
});
