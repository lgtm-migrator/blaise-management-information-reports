import React from "react";
import {cleanup, render, waitFor} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises from "./tests/utils";
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import {mock_server_request_return_json} from "./tests/utils";
import MockDate from "mockdate";


describe("management information reports homepage", () => {
    const newMillennium = "2000-01-01";
    const threeDaysFromTheNewMillennium = "2000-01-03";

    beforeEach(() => {
        mock_server_request_return_json(200, {"last_updated": new Date(newMillennium).toLocaleDateString()});
        MockDate.set(new Date(threeDaysFromTheNewMillennium));
    });

    afterEach(() => {
        MockDate.reset();
    });

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
        const {queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(queryByText(/Management Information Reports/)).toBeInTheDocument();
        expect(queryByText(/Interviewer Call History/)).toBeInTheDocument();
        expect(queryByText(/Interviewer Call Pattern/)).toBeInTheDocument();

    });

    it("shows the correct last updated text", async () => {
        const history = createMemoryHistory();
        const {queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(queryByText(/2 days ago/)).toBeInTheDocument();
            expect(queryByText(/(01\/01\/2000 00:00:00)/)).toBeInTheDocument();
        });
    });

    afterAll(() => {
        cleanup();
    });
});

