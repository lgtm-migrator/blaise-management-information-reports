import {AppointmentResourcePlanningReportData} from "../interfaces";
import "@testing-library/jest-dom";
import flushPromises, {mock_fetch_requests} from "../tests/utilities";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import AppointmentResourcePlanning from "./AppointmentResourcePlanning";
import {act} from "react-dom/test-utils";
import {fireEvent, screen} from "@testing-library/dom";
import React from "react";
import MockDate from "mockdate";

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

const mock_server_response_with_data = () => {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(reportDataReturned),
    });
};

const mock_server_response_without_data = () => {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(""),
    });

};

const christmasEve97 = "1997-12-24";

describe("appointment resource planning report with data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_response_with_data);
        MockDate.set(new Date(christmasEve97));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <AppointmentResourcePlanning/>
            </Router>
        );
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });
    });
    it("renders correctly", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <AppointmentResourcePlanning/>
                </Router>
            );
        });
        expect(screen.queryByText("Run appointment resource planning report")).toBeVisible();
        expect(screen.queryByText("Date")).toBeVisible();
        fireEvent.input(screen.getByLabelText(/Date/i), {
            target: {
                value:
                    "2021-01-01"
            }
        });
        fireEvent.click(screen.getByTestId(/submit-button/i));
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(screen.getByText("Questionnaire")).toBeVisible();
            expect(screen.getByText("Appointment Time")).toBeVisible();
            expect(screen.getByText("Appointment Language")).toBeVisible();
            expect(screen.getByText("Total")).toBeVisible();
            expect(screen.getByText("LMS2101_AA1")).toBeVisible();
            expect(screen.getByText("10:00")).toBeVisible();
            expect(screen.getByText("English")).toBeVisible();
            expect(screen.getByText("42")).toBeVisible();
            expect(screen.getByText("LMS2101_BB1")).toBeVisible();
            expect(screen.getByText("12:30")).toBeVisible();
            expect(screen.getByText("Welsh")).toBeVisible();
            expect(screen.getByText("1908")).toBeVisible();
            expect(screen.getByText("LMS2101_CC1")).toBeVisible();
            expect(screen.getByText("15:15")).toBeVisible();
            expect(screen.getByText("Other")).toBeVisible();
            expect(screen.getByText("408")).toBeVisible();
        });
    });
    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});

describe("appointment resource planning report without data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_response_without_data);
        MockDate.set(new Date(christmasEve97));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <AppointmentResourcePlanning/>
            </Router>
        );
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });
    });
    it("renders correctly", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <AppointmentResourcePlanning/>
                </Router>
            );
        });
        expect(screen.queryByText("Run appointment resource planning report")).toBeVisible();
        expect(screen.queryByText("Date")).toBeVisible();
        fireEvent.input(screen.getByLabelText(/Date/i), {
            target: {
                value:
                    "2021-01-01"
            }
        });
        fireEvent.click(screen.getByTestId(/submit-button/i));
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(screen.queryByText("No data found for parameters given.")).toBeVisible();
        });
    });
    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
