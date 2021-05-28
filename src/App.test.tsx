import React from "react";
import {cleanup, render, waitFor} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises, {mock_server_request_Return_JSON} from "./tests/utils";
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router";

describe("React homepage", () => {

    beforeAll(() => {
        mock_server_request_Return_JSON(200, "data");
    });

    it("view page matches snapshot", async () => {
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

    it("should render correctly", async () => {
        const history = createMemoryHistory();
        const {getByText, queryByText} = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        expect(queryByText(/Interviewer Call History/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(getByText(/Management Information Reports/i)).toBeDefined();
        });

        await waitFor(() => {
            expect(getByText(/Management Information Reports/i)).toBeDefined();
        });

    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
