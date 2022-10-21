/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createMemoryHistory, History } from "history";
import { render, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import { act } from "react-dom/test-utils";
import { fireEvent, screen } from "@testing-library/dom";
import React from "react";
import QuestionnaireFilter from "./QuestionnaireFilter";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import subtractYears from "../../utilities/DateFormatter";
import { InterviewerFilterQuery } from "./InterviewerFilter";

const mockAdapter = new MockAdapter(axios);

const questionnaireDataReturned: string[] = [
    "LMS2101_AA1",
    "LMS2101_AA2",
];

dateFormatter.extend(utc);
dateFormatter.extend(timezone);

describe("the interviewer details page renders correctly", () => {
    let history: History;
    let setQuestionnaires: (questionnaires: string[]) => void;
    let submit: () => void;

    beforeEach(() => {
        mockAdapter
            .onGet("/api/reports/call-history-status")
            //.reply(200, {last_updated: "Sat, 01 Jan 2000 10:00:00 GMT"});
            .reply(200, { last_updated: subtractYears(1) });
        history = createMemoryHistory();
        setQuestionnaires = jest.fn();
        submit = jest.fn();
    });

    afterEach(() => {
        mockAdapter.reset();
    });

    function renderComponent() {
        const interviewerFilterQuery: InterviewerFilterQuery = {
            interviewer: "James",
            startDate: new Date("2022-01-01"),
            endDate: new Date("2022-01-05"),
            surveyTla: "LMS"
        };

        return render(
            <Router history={ history }>
                <QuestionnaireFilter
                    interviewerFilterQuery={interviewerFilterQuery}
                    questionnaires={ ["LMS2101_AA1"] } setQuestionnaires={ setQuestionnaires }
                    onSubmit={ submit }
                    navigateBack={ () => {
                        return;
                    }}
                />
            </Router>
        );
    }

    it("posts the query params", async () => {
        expect.assertions(4);
        mockAdapter.onPost(
            "/api/questionnaires",
            {
                asymmetricMatch: (formData: FormData) => {
                    expect(formData.get("survey_tla")).toBe("LMS");
                    expect(formData.get("interviewer")).toBe("James");
                    expect(formData.get("start_date")).toBe("2022-01-01");
                    expect(formData.get("end_date")).toBe("2022-01-05");
                    return true;
                }
            }
        ).reply(200, questionnaireDataReturned);
        renderComponent();

        // Wait for loading to finish (avoid warnings)
        await screen.findByText("LMS2101_AA1");
    });

    it("matches loading snapshot", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);
        const wrapper = renderComponent();
        expect(wrapper).toMatchSnapshot();

        // Wait for loading to finish (avoid warnings)
        await screen.findByText("LMS2101_AA1");
    });

    it("matches snapshot", async () => {
        // This snapshot will need to be updated in 1 years time (28/06/2023)
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);
        mockAdapter
            .onGet("/api/reports/call-history-status")
            .reply(200, { last_updated: "Sat, 01 Jan 2000 10:00:00 GMT" });
        const wrapper = renderComponent();
        await screen.findByText("LMS2101_AA1");
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correctly", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);

        await act(async () => {
            renderComponent();
        });

        expect(screen.queryByText(/Select questionnaire/i)).toBeVisible();
        expect(screen.queryByText(/Data in this report was last updated:/i)).toBeVisible();

        expect(screen.queryByText(/1 year ago/i)).toBeVisible();

        expect(screen.queryByText(/Interviewer: James/i)).toBeVisible();
        expect(screen.queryByText(/Period: 01\/01\/2022–05\/01\/2022/i)).toBeVisible();

        expect(screen.queryByText(/Questionnaire: LMS2101_AA1/i)).toBeVisible();
        expect(screen.queryByText(/Run report/i)).toBeVisible();
    });

    it("displays a message when not questionnaires are returned", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, []);
        renderComponent();
        await screen.findByText("No questionnaires found for given parameters.");
    });

    it("displays an error when an error HTTP status is returned", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(500, []);
        renderComponent();
        await screen.findByText("An error occurred while fetching the list of questionnaires");
    });

    it("displays an error when a non-200 success HTTP status is returned", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(201, questionnaireDataReturned);
        renderComponent();
        await screen.findByText("An error occurred while fetching the list of questionnaires");
    });

    it("checks all provided questionnaires by default", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);
        renderComponent();
        await act(async () => {
            fireEvent.click(await screen.findByText(/Run report/));
        });
        expect(setQuestionnaires).toHaveBeenCalledWith(["LMS2101_AA1"]);
        expect(submit).toHaveBeenCalled();
    });

    it("returns the questionnaires when a checkbox is ticket", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);
        renderComponent();
        await act(async () => {
            fireEvent.click(await screen.findByLabelText(/LMS2101_AA1/));
            fireEvent.click(await screen.findByLabelText(/LMS2101_AA2/));
            fireEvent.click(await screen.findByText(/Run report/));
        });
        expect(setQuestionnaires).toHaveBeenCalledWith(["LMS2101_AA2"]);
        expect(submit).toHaveBeenCalled();
    });

    it("displays an error when submitting with no checkboxes selected", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnaireDataReturned);
        renderComponent();
        await act(async () => {
            fireEvent.click(await screen.findByLabelText(/LMS2101_AA1/));
            fireEvent.click(await screen.findByText(/Run report/));
        });
        const elements = await screen.findAllByText("At least one questionnaire must be selected");
        expect(elements[0]).toBeVisible();
        expect(elements[1]).toBeVisible();
        expect(setQuestionnaires).not.toHaveBeenCalled();
        expect(submit).not.toHaveBeenCalled();
    });
});
