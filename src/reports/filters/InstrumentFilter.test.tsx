/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import {act} from "react-dom/test-utils";
import {screen} from "@testing-library/dom";
import React from "react";
import InstrumentFilter from "./InstrumentFilter";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {History} from "history";

const mockAdapter = new MockAdapter(axios);

const instrumentDataReturned: string[] = [
    "LMS2101_AA1"
];

describe("the interviewer details page renders correctly", () => {
    let history: History;

    beforeEach(() => {
        history = createMemoryHistory();
    });

    afterEach(() => {
        mockAdapter.reset();
    });

    function renderComponent() {
        return render(
            <Router history={history}>
                <InstrumentFilter interviewer="James"
                                  startDate={new Date("2022-01-01")}
                                  endDate={new Date("2022-01-05")}
                                  surveyTla="LMS"
                                  instruments={["LMS2101_AA1"]} setInstruments={() => {return;}}
                                  submitFunction={() => {return;}}
                                  navigateBack={() => {return;}}/>
            </Router>
        );
    }

    it("matches loading snapshot", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, instrumentDataReturned);
        const wrapper = renderComponent();
        expect(wrapper).toMatchSnapshot();
    });

    it("matches snapshot", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, instrumentDataReturned);
        const wrapper = renderComponent();
        await screen.findByText("LMS2101_AA1");
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correctly", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, instrumentDataReturned);

        await act(async () => {
            renderComponent();
        });

        expect(screen.queryByText(/Select questionnaire/i)).toBeVisible();
        expect(screen.queryByText(/Data in this report was last updated:/i)).toBeVisible();

        expect(screen.queryByText(/Interviewer: James/i)).toBeVisible();
        expect(screen.queryByText(/Period: 01\/01\/2022–05\/01\/2022/i)).toBeVisible();

        expect(screen.queryByText(/LMS2101_AA1/i)).toBeVisible();
        expect(screen.queryByText(/Run report/i)).toBeVisible();
    });

    it("displays a message when not questionnaires are returned", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, []);
        renderComponent();
        await waitFor(() => {
            screen.getByText("No data found for parameters given.");
        });
    });

    afterAll(() => {
        cleanup();
    });
});
