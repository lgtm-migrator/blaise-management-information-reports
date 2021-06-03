import React from "react";
import {cleanup, render, waitFor} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises from "./tests/utils";
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

        expect(queryByText(/Management Information Reports/)).toBeInTheDocument();
        expect(queryByText(/Interviewer Call History/)).toBeInTheDocument();

    });

    afterAll(() => {
        cleanup();
    });
});

