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
import InterviewerFilter from "./InterviewerFilter";

describe("the interviewer details page renders correctly", () => {
    it("matches snapshot", async () => {
        const history = createMemoryHistory();

        const wrapper = render(
            <Router history={history}>
                <InterviewerFilter title=""
                    interviewer={"James"} setInterviewer={jest.fn()}
                    startDate={new Date("2021-01-01")} setStartDate={jest.fn()}
                    endDate={new Date("2021-01-05")} setEndDate={jest.fn()}
                    surveyTla={"LMS"} setSurveyTla={jest.fn()}
                    submitFunction={() => jest.fn()}/>
            </Router>
        );

        jest.useRealTimers();

        expect(await wrapper).toMatchSnapshot();
    });

    it("renders correctly", async () => {
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <InterviewerFilter title=""
                    interviewer={"James"} setInterviewer={jest.fn()}
                    startDate={new Date("2021-01-01")} setStartDate={jest.fn()}
                    endDate={new Date("2021-01-05")} setEndDate={jest.fn()}
                    surveyTla={"LMS"} setSurveyTla={jest.fn()}
                    submitFunction={jest.fn()}/>
            </Router>
        );

        expect(screen.getByText(/Run interviewer/i)).toBeVisible();
        expect(screen.getByText(/Data in this report was last updated:/i)).toBeVisible();

        expect(screen.getByText(/Select survey/i)).toBeVisible();
        expect(screen.getByText(/Show all surveys/i)).toBeVisible();
        expect(screen.getByText(/LMS/i)).toBeVisible();
        expect(screen.getByText(/OPN/i)).toBeVisible();

        expect(screen.getByText(/Interviewer ID/i)).toBeVisible();

        expect(screen.getByText(/Start date/i)).toBeVisible();
        expect(screen.getByText(/End date/i)).toBeVisible();
    });
});
