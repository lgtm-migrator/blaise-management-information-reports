import "@testing-library/jest-dom";
import React from "react";
import flushPromises, {mock_fetch_requests} from "../tests/utilities";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import {act} from "react-dom/test-utils";
import {fireEvent, screen} from "@testing-library/dom";
import InterviewerCallPattern, {
    formatToFractionAndPercentage,
    callTimeSection,
    callStatusSection,
    noContactBreakdownSection
} from "./InterviewerCallPattern";
import MockDate from "mockdate";

const mockData: Record<string, any> = {
    total_valid_records: 133,
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: 5.66,
    average_calls_per_hour: 3.86,
    refusals: 4,
    completed_successfully: 0,
    appointments_for_contacts: 86,
    no_contacts: 11,
    no_contact_answer_service: 4,
    no_contact_busy: 1,
    no_contact_disconnect: 2,
    no_contact_no_answer: 3,
    no_contact_other: 4
};

const mockDataWithInvalidCases: Record<string, any> = {
    total_valid_records: 133,
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: 5.66,
    average_calls_per_hour: 3.86,
    refusals: 4,
    completed_successfully: 0,
    appointments_for_contacts: 86,
    discounted_invalid_cases: 29,
    no_contacts: 11,
    no_contact_answer_service: 4,
    no_contact_busy: 1,
    no_contact_disconnect: 2,
    no_contact_no_answer: 3,
    no_contact_other: 4,
    invalid_fields: "'status' column had timed out call status,'call_end_time' column had missing data"
};

const mockDataWithOnlyInvalidCases: Record<string, any> = {
    discounted_invalid_cases: 100,
    invalid_fields: "'status' column had timed out call status,'call_end_time' column had missing data"
};

const mock_server_responses_with_data = (url: string) => {
    console.log(url);
    if (url.includes("/api/reports/interviewer-call-pattern")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(reportDataReturned),
        });
    } else if (url.includes("/api/reports/call-history-status")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ "last_updated": "Tue, 01 Jan 2000 10:00:00 GMT" }),
        });
    }
};

const mock_server_responses_with_invalid_data = (url: string) => {
    console.log(url);
    if (url.includes("/api/reports/interviewer-call-pattern")) {
        const reportDataReturnedWithInvalid: Record<string, any> = Object.create(reportDataReturned);
        reportDataReturnedWithInvalid.invalid_fields = "'status' column had timed out call status,'call_end_time' column had missing data";
        reportDataReturnedWithInvalid.discounted_invalid_cases = "29/133, 21.80%";
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(reportDataReturnedWithInvalid),
        });
    } else if (url.includes("/api/reports/call-history-status")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ "last_updated": "Tue, 01 Jan 2000 10:00:00 GMT" }),
        });
    }
};

const mock_server_responses_without_data = (url: string) => {
    console.log(url);
    if (url.includes("/api/reports/interviewer-call-pattern")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(""),
        });
    } else if (url.includes("/api/reports/call-history-status")) {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(""),
        });
    }
};

const threeDaysFromTheNewMillennium = "2000-01-03";

describe("interviewer call pattern report with data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_responses_with_data);
        MockDate.set(new Date(threeDaysFromTheNewMillennium));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();

        const wrapper = render(
            <Router history={history}>
                <InterviewerCallPattern/>
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
                    <InterviewerCallPattern/>
                </Router>
            );
        });

        expect(screen.queryByText(/Data in this report was last updated:/i)).toBeVisible();
        expect(screen.queryByText(/2 days ago/i)).toBeVisible();
        expect(screen.queryByText("Run interviewer call pattern report")).toBeVisible();
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Interviewer ID")).toBeVisible();
        expect(screen.queryByText("Start date")).toBeVisible();
        expect(screen.queryByText("End date")).toBeVisible();

        fireEvent.click(screen.getByText("LMS"));

        fireEvent.input(screen.getByLabelText(/Interviewer ID/i), {
            target: {
                value:
                    "ricer"
            }
        });

        await fireEvent.click(screen.getByTestId(/submit-button/i));

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(screen.getByText("Export report as Comma-Separated Values (CSV) file")).toBeVisible();

            expect(screen.getByText("Call times")).toBeVisible();
            expect(screen.getByText("Hours worked")).toBeVisible();
            expect(screen.getByText("26:58:07")).toBeVisible();
            expect(screen.getByText("Call time")).toBeVisible();
            expect(screen.getByText("01:31:32")).toBeVisible();
            expect(screen.getByText("Hours on calls percentage")).toBeVisible();
            expect(screen.getByText("5.66%")).toBeVisible();
            expect(screen.getByText("Average calls per hour")).toBeVisible();
            expect(screen.getByText("3.86")).toBeVisible();

            expect(screen.getByText("Call status")).toBeVisible();
            expect(screen.getByText("Refusals")).toBeVisible();
            expect(screen.getByText("4/133, 3.01%")).toBeVisible();
            expect(screen.getByText("Completed successfully")).toBeVisible();
            expect(screen.getByText("0/133, 0.00%")).toBeVisible();
            expect(screen.getByText("Appointments for contacts")).toBeVisible();
            expect(screen.getByText("86/133, 64.66%")).toBeVisible();
            expect(screen.getByText("Discounted invalid cases")).toBeVisible();
            expect(screen.queryByText("29/133, 21.80%")).not.toBeInTheDocument();
            expect(screen.getByText("No contacts")).toBeVisible();
            expect(screen.getByText("11/133, 8.27%")).toBeVisible();

            expect(screen.getByText("Breakdown of No Contact calls")).toBeVisible();
            expect(screen.getByText("Answer service")).toBeVisible();
            expect(screen.queryAllByText("4/11, 36.36%")[0]).toBeVisible();
            expect(screen.getByText("Busy")).toBeVisible();
            expect(screen.getByText("1/11, 9.09%")).toBeVisible();
            expect(screen.getByText("Disconnect")).toBeVisible();
            expect(screen.getByText("2/11, 18.18%")).toBeVisible();
            expect(screen.getByText("No answer")).toBeVisible();
            expect(screen.getByText("3/11, 27.27%")).toBeVisible();
            expect(screen.getByText("Other")).toBeVisible();
            expect(screen.queryAllByText("4/11, 36.36%")[1]).toBeVisible();
        });

        expect(screen.queryByText(/were discounted due to the following invalid fields/i)).not.toBeInTheDocument();
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});

describe("interviewer call pattern report with data and invalid data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_responses_with_invalid_data);
        MockDate.set(new Date(threeDaysFromTheNewMillennium));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();

        const wrapper = render(
            <Router history={history}>
                <InterviewerCallPattern/>
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
                    <InterviewerCallPattern/>
                </Router>
            );
        });

        expect(screen.queryByText(/Data in this report was last updated:/i)).toBeVisible();
        expect(screen.queryByText(/2 days ago/i)).toBeVisible();
        expect(screen.queryByText("Run interviewer call pattern report")).toBeVisible();
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Interviewer ID")).toBeVisible();
        expect(screen.queryByText("Start date")).toBeVisible();
        expect(screen.queryByText("End date")).toBeVisible();

        fireEvent.click(screen.getByText("LMS"));

        fireEvent.input(screen.getByLabelText(/Interviewer ID/i), {
            target: {
                value:
                    "ricer"
            }
        });

        await fireEvent.click(screen.getByTestId(/submit-button/i));

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(screen.getByText("Export report as Comma-Separated Values (CSV) file")).toBeVisible();

            expect(screen.getByText("Call times")).toBeVisible();
            expect(screen.getByText("Hours worked")).toBeVisible();
            expect(screen.getByText("26:58:07")).toBeVisible();
            expect(screen.getByText("Call time")).toBeVisible();
            expect(screen.getByText("01:31:32")).toBeVisible();
            expect(screen.getByText("Hours on calls percentage")).toBeVisible();
            expect(screen.getByText("5.66%")).toBeVisible();
            expect(screen.getByText("Average calls per hour")).toBeVisible();
            expect(screen.getByText("3.86")).toBeVisible();

            expect(screen.getByText("Call status")).toBeVisible();
            expect(screen.getByText("Refusals")).toBeVisible();
            expect(screen.getByText("4/133, 3.01%")).toBeVisible();
            expect(screen.getByText("Completed successfully")).toBeVisible();
            expect(screen.getByText("0/133, 0.00%")).toBeVisible();
            expect(screen.getByText("Appointments for contacts")).toBeVisible();
            expect(screen.getByText("86/133, 64.66%")).toBeVisible();
            expect(screen.getByText("Discounted invalid cases")).toBeVisible();
            expect(screen.getByText("29/133, 21.80%")).toBeVisible();
            expect(screen.getByText("No contacts")).toBeVisible();
            expect(screen.getByText("11/133, 8.27%")).toBeVisible();

            expect(screen.getByText("Breakdown of No Contact calls")).toBeVisible();
            expect(screen.getByText("Answer service")).toBeVisible();
            expect(screen.queryAllByText("4/11, 36.36%")[0]).toBeVisible();
            expect(screen.getByText("Busy")).toBeVisible();
            expect(screen.getByText("1/11, 9.09%")).toBeVisible();
            expect(screen.getByText("Disconnect")).toBeVisible();
            expect(screen.getByText("2/11, 18.18%")).toBeVisible();
            expect(screen.getByText("No answer")).toBeVisible();
            expect(screen.getByText("3/11, 27.27%")).toBeVisible();
            expect(screen.getByText("Other")).toBeVisible();
            expect(screen.queryAllByText("4/11, 36.36%")[1]).toBeVisible();

            expect(screen.getByText(/were discounted due to the following invalid fields/i)).toBeVisible();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});

describe("interviewer call pattern report without data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_responses_without_data);
        MockDate.set(new Date(threeDaysFromTheNewMillennium));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();

        const wrapper = render(
            <Router history={history}>
                <InterviewerCallPattern/>
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
                    <InterviewerCallPattern/>
                </Router>
            );
        });

        expect(screen.queryByText("Run interviewer call pattern report")).toBeVisible();
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Interviewer ID")).toBeVisible();
        expect(screen.queryByText("Start date")).toBeVisible();
        expect(screen.queryByText("End date")).toBeVisible();

        fireEvent.click(screen.getByText("LMS"));

        fireEvent.input(screen.getByLabelText(/Interviewer ID/i), {
            target: {
                value:
                    "ricer"
            }
        });

        await fireEvent.click(screen.getByTestId(/submit-button/i));

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(screen.queryByText("Export report as Comma-Separated Values (CSV) file")).not.toBeVisible();
            expect(screen.queryByText("No data found for parameters given.")).toBeVisible();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});

describe("interviewer call pattern report with only invalid data", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        mock_fetch_requests(mock_server_responses_with_only_invalid_data);
        MockDate.set(new Date(threeDaysFromTheNewMillennium));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();

        const wrapper = render(
            <Router history={history}>
                <InterviewerCallPattern/>
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
                    <InterviewerCallPattern/>
                </Router>
            );
        });

        expect(screen.queryByText(/Data in this report was last updated:/i)).toBeVisible();
        expect(screen.queryByText(/2 days ago/i)).toBeVisible();
        expect(screen.queryByText("Run interviewer call pattern report")).toBeVisible();
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Interviewer ID")).toBeVisible();
        expect(screen.queryByText("Start date")).toBeVisible();
        expect(screen.queryByText("End date")).toBeVisible();

        fireEvent.click(screen.getByText("LMS"));

        fireEvent.input(screen.getByLabelText(/Interviewer ID/i), {
            target: {
                value:
                    "ricer"
            }
        });

        await fireEvent.click(screen.getByTestId(/submit-button/i));

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(screen.queryByText("Export report as Comma-Separated Values (CSV) file")).not.toBeVisible();
            expect(screen.queryByText("Call times")).not.toBeInTheDocument();
            expect(screen.queryByText("Call status")).not.toBeInTheDocument();
            expect(screen.queryByText("Breakdown of no Contact calls")).not.toBeInTheDocument();
            expect(screen.queryByText("Invalid Fields")).not.toBeInTheDocument();

            expect(screen.getByText(/Information: 100\/100 records \(100%\) were discounted due to the following invalid fields:/i)).toBeVisible();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
