/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import { screen } from "@testing-library/dom";
import React from "react";
import InterviewerFilter from "./InterviewerFilter";
import userEvent from "@testing-library/user-event";

describe("the interviewer details page renders correctly", () => {

    let setInterviewer: () => void;
    let setStartDate: () => void;
    let setEndDate: () => void;
    let setSurveyTla: () => void;
    let submitFunction: () => void;

    let view: RenderResult;

    beforeEach(() => {
        setInterviewer = jest.fn();
        setStartDate = jest.fn();
        setEndDate = jest.fn();
        setSurveyTla = jest.fn();
        submitFunction = jest.fn();

        const history = createMemoryHistory();

        view = render(
            <Router history={ history }>
                <InterviewerFilter
                    title=""
                    interviewer={ "James" }
                    setInterviewer={ setInterviewer }
                    startDate={ new Date("2021-01-01") }
                    setStartDate={ setStartDate }
                    endDate={ new Date("2021-01-05") }
                    setEndDate={ setEndDate }
                    surveyTla={ "LMS" }
                    setSurveyTla={ setSurveyTla }
                    submitFunction={ submitFunction }/>
            </Router>
        );
    });

    it("matches snapshot", async () => {
        jest.useRealTimers();

        expect(await view).toMatchSnapshot();
    });

    it("renders correctly", async () => {
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

    it("updates the values", async () => {
        const interviewer = screen.getByRole("textbox", { name: "Interviewer ID" });
        userEvent.clear(interviewer);
        userEvent.type(interviewer, "rich");

        const startDate = screen.getByLabelText("Start date");
        userEvent.clear(startDate);
        userEvent.type(startDate, "2022-10-10");

        const endDate = screen.getByLabelText("End date");
        userEvent.clear(endDate);
        userEvent.type(endDate, "2022-10-11");

        const survey = screen.getByRole("radio", { name: "LMS Labour Market Survey" });
        userEvent.click(survey);

        userEvent.click(screen.getByRole("button", { name: "Next" }));

        await waitFor(() => {
            expect(setInterviewer).toHaveBeenCalledWith("rich");
            expect(setStartDate).toHaveBeenCalledWith("2022-10-10");
            expect(setEndDate).toHaveBeenCalledWith("2022-10-11");
            expect(setSurveyTla).toHaveBeenCalledWith("lms");
            expect(submitFunction).toHaveBeenCalled();
        });
    });
});
