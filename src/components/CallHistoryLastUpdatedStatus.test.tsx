/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { Router } from "react-router";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";
import React from "react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import CallHistoryLastUpdatedStatus from "./CallHistoryLastUpdatedStatus";
import flushPromises from "../tests/utilities";
import subtractYears, { formatDateAndTime } from "../utilities/DateFormatter";

const mockAdapter = new MockAdapter(axios);

const dateOneYearAgo = subtractYears(1);

describe("call history last updated status with data", () => {
    beforeEach(() => {
        mockAdapter.onGet("/api/reports/call-history-status").reply(
            200,
            { last_updated: dateOneYearAgo },
        );
    });

    afterEach(() => {
        mockAdapter.reset();
    });

    it("matches snapshot", async () => {
        // This snapshot will need to be updated in 1 years time (28/06/2023)
        mockAdapter
            .onGet("/api/reports/call-history-status")
            .reply(200, { last_updated: "Sat, 01 Jan 2000 10:00:00 GMT" });
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryLastUpdatedStatus />
            </Router>,
        );
        await act(async () => {
            await flushPromises();
        });

        expect(await wrapper).toMatchSnapshot();
    });

    it("renders correctly", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryLastUpdatedStatus />
                </Router>,
            );
        });
        expect(screen.queryByText("Data in this report was last updated:")).toBeVisible();
        expect(screen.queryByText("Data in this report only goes back to the last 12 months.")).toBeVisible();
        await act(async () => {
            await flushPromises();
        });
        expect(await screen.findByText(`(${formatDateAndTime(dateOneYearAgo)})`)).toBeVisible();
    });
});

describe("call history last updated status with invalid data", () => {
    beforeEach(() => {
        mockAdapter.onGet("/api/reports/call-history-status").reply(200, "blah");
    });

    afterEach(() => {
        mockAdapter.reset();
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryLastUpdatedStatus />
            </Router>,
        );
        await act(async () => {
            await flushPromises();
        });

        expect(await wrapper).toMatchSnapshot();
    });

    it("renders correctly", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryLastUpdatedStatus />
                </Router>,
            );
        });
        expect(screen.queryByText("Data in this report was last updated:")).toBeVisible();
        expect(screen.queryByText("Data in this report only goes back to the last 12 months.")).toBeVisible();
        await act(async () => {
            await flushPromises();
        });

        expect(await screen.findByText("Invalid Date")).toBeVisible();
    });
});
