import React from "react";
import {cleanup, render, waitFor} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises, {mock_server_request_return_json} from "./tests/utils";
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import {convertSecondsToMinutesAndSeconds} from "./utilities/http";
import InterviewerCallHistory from "./reports/InterviewerCallHistory";
import {ReportData} from "./interfaces";

test("test 60 seconds is converted to 01:00", () => {
    expect(convertSecondsToMinutesAndSeconds(60)).toBe("01:00");
});

test("test 61 seconds is converted to 01:01", () => {
    expect(convertSecondsToMinutesAndSeconds(61)).toBe("01:01");
});

test("test 120 seconds is converted to 02:00", () => {
    expect(convertSecondsToMinutesAndSeconds(120)).toBe("02:00");
});

test("test 121 seconds is converted to 02:01", () => {
    expect(convertSecondsToMinutesAndSeconds(121)).toBe("02:01");
});

test("test 3600 seconds is converted to 60:00", () => {
    expect(convertSecondsToMinutesAndSeconds(3600)).toBe("60:00");
});

test("test 3601 seconds is converted to 60:01", () => {
    expect(convertSecondsToMinutesAndSeconds(3601)).toBe("60:01");
});

test("test 0 seconds is converted to 00:00", () => {
    expect(convertSecondsToMinutesAndSeconds(0)).toBe("00:00");
});

test("test empty string is converted to 00:00", () => {
    expect(convertSecondsToMinutesAndSeconds("")).toBe("00:00");
});

describe("management information reports homepage", () => {

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <App/>
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
        const {getByText, queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(queryByText(/Management Information Reports/i)).toBeInTheDocument();
        expect(queryByText(/Interviewer Call History/)).toBeInTheDocument();

    });

    afterAll(() => {
        cleanup();
    });
});

// TODO fix this test, mocked data isn't being passed in...
describe("interviewer call history report", () => {

    const reportDataReturned: ReportData[] = [

    {
        questionnaire_name: "LMS2101_AA1",
        serial_number: "1337",
        call_start_time: "Sat, 01 May 2021 10:00:00 GMT",
        dial_secs: "61",
        number_of_interviews: "5",
        call_result: "Busy",
}];

    beforeAll(() => {
        mock_server_request_return_json(200, reportDataReturned);
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <InterviewerCallHistory/>
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
        const {getByText, queryByText} = render(
            <Router history={history}>
                <InterviewerCallHistory/>
            </Router>
        );

        expect(queryByText(/Run interviewer call history report/)).toBeInTheDocument();
        expect(queryByText(/Interviewer ID/)).toBeInTheDocument();
        expect(queryByText(/Start Date/)).toBeInTheDocument();
        expect(queryByText(/End Date/)).toBeInTheDocument();

        await waitFor(() => {
            expect(getByText(/LMS2101_AA1/i)).toBeDefined();
            //expect(getByText(/01\/05\/2021 10:00:00/i)).toBeDefined();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
