import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { Router } from "react-router";
import CallHistoryReportTable from "./CallHistoryReportTable";
import { act } from "react-dom/test-utils";
import React from "react";
import { screen } from "@testing-library/dom";
import flushPromises from "../tests/utilities";
import { InterviewerCallHistoryReport } from "../interfaces";

const reportData: InterviewerCallHistoryReport = {
    call_result: "Appointment",
    dial_secs: 90,
    questionnaire_name: "LMS2101_AA1",
    serial_number: "900001",
    call_start_time: "2022-01-31T09:00-0000"
};
const messageNoData = "No data found for parameters given.";

describe("CallHistoryReportTable", () => {
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
            </Router>
        );
        await act(async () => {
            await flushPromises();
        });
        expect(await wrapper).toMatchSnapshot();
    });

    it("displays a heading of 'Questionnaire'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("Questionnaire")).toBeVisible();
    });

    it("displays a heading of 'Serial number'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("Serial Number")).toBeVisible();
    });

    it("displays a heading of 'Call Start Time'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("Call Start Time")).toBeVisible();
    });

    it("displays a heading of 'Call Length'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("Call Length")).toBeVisible();
    });

    it("displays a heading of 'Call Result'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("Call Result")).toBeVisible();
    });

    it("displays the relevant information for each heading", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={[reportData]}/>
                </Router>
            );
        });
        expect(screen.queryByText("LMS2101_AA1")).toBeVisible();
        expect(screen.queryByText("900001")).toBeVisible();
        expect(screen.queryByText("31/01/2022 09:00:00")).toBeVisible();
        expect(screen.queryByText("01:30")).toBeVisible();
        expect(screen.queryByText("Appointment")).toBeVisible();
    });
});
