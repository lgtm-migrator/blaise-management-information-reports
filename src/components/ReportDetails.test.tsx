import React from "react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { cleanup, render, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import ReportDetails from "./ReportDetails";
import { act } from "react-dom/test-utils";
import flushPromises from "../tests/utilities";
import { screen } from "@testing-library/dom";

describe("ReportDetails", () => {
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <ReportDetails link=""title="" description="" />
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
                    <ReportDetails link="blah-link" title="blah-title" description="blah-description" />
                </Router>
            );
        });
        expect(screen.queryByText("blah-title")).toBeVisible();
        expect(screen.queryByText("blah-description")).toBeVisible();
    });
    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});