import "@testing-library/jest-dom";
import flushPromises from "../tests/utilities";
import {createMemoryHistory} from "history";
import {cleanup, render, waitFor} from "@testing-library/react";
import {Router} from "react-router";
import SurveyInterviewerStartDateEndDateForm from "./SurveyInterviewerStartDateEndDateForm";
import {act} from "react-dom/test-utils";
import {screen} from "@testing-library/dom";
import React from "react";

describe("form - survey, interviewer, start date, end date", () => {
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <SurveyInterviewerStartDateEndDateForm onSubmitFunction=""/>
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
                    <SurveyInterviewerStartDateEndDateForm onSubmitFunction=""/>
                </Router>
            );
        });
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Show all surveys")).toBeVisible();
        expect(screen.queryByText("LMS")).toBeVisible();
        expect(screen.queryByText("Labour Market Survey")).toBeVisible();
        expect(screen.queryByText("OPN")).toBeVisible();
        expect(screen.queryByText("Opinions and Lifestyle Survey")).toBeVisible();
        expect(screen.queryByText("Interviewer ID")).toBeVisible();
        expect(screen.queryByText("Start date")).toBeVisible();
        expect(screen.queryByText("End date")).toBeVisible();
        expect(screen.queryByText("Save and continue")).toBeVisible();

    });
    afterAll(() => {
        cleanup();
    });
});
