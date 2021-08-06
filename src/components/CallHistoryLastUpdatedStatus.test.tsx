import "@testing-library/jest-dom";
import flushPromises, {mock_fetch_requests} from "../tests/utilities";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import CallHistoryLastUpdatedStatus from "./CallHistoryLastUpdatedStatus";
import {act} from "react-dom/test-utils";
import {fireEvent, screen} from "@testing-library/dom";
import React from "react";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

const mock_server_response_with_data = () => {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({"last_updated": "Sat, 01 Jan 2000 10:00:00 GMT"}),
    });
};

const mock_server_response_with_invalid_data = () => {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve("blah"),
    });
};

describe("call history last updated status with data", () => {
    beforeEach(() => {
        mock_fetch_requests(mock_server_response_with_data);
    });
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryLastUpdatedStatus/>
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
                    <CallHistoryLastUpdatedStatus/>
                </Router>
            );
        });
        expect(screen.queryByText("Data in this report was last updated:")).toBeVisible();
        expect(screen.queryByText("Data in this report only goes back to the last 12 months.")).toBeVisible();
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(screen.getByText("(01/01/2000 10:00:00)")).toBeVisible();
        });
    });
    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});

describe("call history last updated status with invalid data", () => {
    beforeEach(() => {
        mock_fetch_requests(mock_server_response_with_invalid_data);
    });
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryLastUpdatedStatus/>
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
                    <CallHistoryLastUpdatedStatus/>
                </Router>
            );
        });
        expect(screen.queryByText("Data in this report was last updated:")).toBeVisible();
        expect(screen.queryByText("Data in this report only goes back to the last 12 months.")).toBeVisible();
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(screen.getByText("Invalid Date")).toBeVisible();
        });
    });
    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
