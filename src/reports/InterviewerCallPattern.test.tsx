import "@testing-library/jest-dom";
import React from "react";
import flushPromises, {mock_fetch_requests, mock_server_request_return_json} from "../tests/utilities";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import {act} from "react-dom/test-utils";
import {fireEvent, screen} from "@testing-library/dom";
import InterviewerCallPattern, {
    callTimeSection,
    callStatusSection,
    noContactBreakdownSection,
    invalidFieldsGroup
} from "./InterviewerCallPattern";
import MockDate from "mockdate";
import {Group} from "blaise-design-system-react-components";

const mockData: Record<string, any> = {
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: "5.66%",
    average_calls_per_hour: "3.86",
    refusals: "4/133, 3.01%",
    completed_successfully: "0/133, 0.00%",
    appointments_for_contacts: "86/133, 64.66%",
    no_contacts: "11/133, 8.27%",
    no_contact_answer_service: "4/11, 36.36%",
    no_contact_busy: "1/11, 9.09%",
    no_contact_disconnect: "2/11, 18.18%",
    no_contact_no_answer: "3/11, 18.18%",
    no_contact_other: "4/11, 18.18%"
};

const mockDataWithInvalidCases: Record<string, any> = {
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: "5.66%",
    average_calls_per_hour: "3.86",
    refusals: "4/133, 3.01%",
    completed_successfully: "0/133, 0.00%",
    appointments_for_contacts: "86/133, 64.66%",
    discounted_invalid_cases: "29/133, 21.80%",
    no_contacts: "11/133, 8.27%",
    no_contact_answer_service: "4/11, 36.36%",
    no_contact_busy: "1/11, 9.09%",
    no_contact_disconnect: "2/11, 18.18%",
    no_contact_no_answer: "3/11, 18.18%",
    no_contact_other: "4/11, 18.18%"
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
            expect(screen.getByText("4/11, 36.36%")).toBeVisible();
            expect(screen.getByText("Busy")).toBeVisible();
            expect(screen.getByText("1/11, 9.09%")).toBeVisible();
            expect(screen.getByText("Disconnect")).toBeVisible();
            expect(screen.getByText("2/11, 18.18%")).toBeVisible();
            expect(screen.getByText("No answer")).toBeVisible();
            expect(screen.getByText("3/11, 18.18%")).toBeVisible();
            expect(screen.getByText("Other")).toBeVisible();
            expect(screen.getByText("4/11, 18.18%")).toBeVisible();
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
            expect(screen.getByText("4/11, 36.36%")).toBeVisible();
            expect(screen.getByText("Busy")).toBeVisible();
            expect(screen.getByText("1/11, 9.09%")).toBeVisible();
            expect(screen.getByText("Disconnect")).toBeVisible();
            expect(screen.getByText("2/11, 18.18%")).toBeVisible();
            expect(screen.getByText("No answer")).toBeVisible();
            expect(screen.getByText("3/11, 18.18%")).toBeVisible();
            expect(screen.getByText("Other")).toBeVisible();
            expect(screen.getByText("4/11, 18.18%")).toBeVisible();
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
