/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import QuestionnaireSelector from "./QuestionnaireSelector";
import React from "react";
import { createMemoryHistory, History } from "history";
import { cleanup, render, RenderResult, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import { fireEvent, screen } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import flushPromises from "../tests/utilities";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { forEach } from "lodash";

const mockAdapter = new MockAdapter(axios);

const instrumentDataReturned: string[] = [
    "LMS2101_AA1",
    "LMS2101_AA2",
];

const questionnairesReturned = ["LMS2101_AA1", "LMS2101_BB1", "LMS2101_CC1"];
describe("QuestionnaireSelector tests", () => {
    let history: History;
    let setInstruments: (instruments: string[]) => void;
    let submit: () => void;
    let wrapper: RenderResult
    
    beforeEach(async () =>{
        const axiosMock = new MockAdapter(axios);
        history = createMemoryHistory();
        axiosMock.onPost("/api/instruments").reply(200, questionnairesReturned);
        setInstruments = jest.fn();
        submit = jest.fn();
        await act(async () => {
            wrapper = renderComponent();
        })
    });

    afterEach(() => {
        mockAdapter.reset();
    });
    
    function renderComponent(){
        return render(
            <Router history={history}>
                <QuestionnaireSelector interviewer="Cal"
                                  startDate={ new Date("2022-05-04") }
                                  endDate={ new Date("2022-05-05") }
                                  surveyTla="LMS"
                                  instruments={ questionnairesReturned } 
                                  setInstruments={ setInstruments }
                                  submitFunction={ submit }/>
            </Router>
        );
    }

    it("matches snapshot", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, instrumentDataReturned);
        await act(async () => {
            await flushPromises();
        });
        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });
    });

    it("displays a 'Select All' button", async () => {
        expectSelectAllToBeDefined(wrapper);
    });
    it("displays all available questionnaires", async () =>{
        expectAvailableQuestionnairesToBeDefined(wrapper);
    })
    it("displays all available questionnaires", async () =>{
        expectRadioButtonsForEachQuestionnaireToBeDefined(wrapper, questionnairesReturned);
    })

    describe("when a questionnaire is selected", () => {
        it("displays a tick in the checkbox", () =>{
            expectTickWhenAQuestionnaireIsSelected(wrapper)
        })
    })
    describe("when 'Select all' is selected", () => {
        it("selects all questionnaires", async () =>{
            expectSelectAllToSelectAllQuestionnaires(wrapper, questionnairesReturned)
        })
        it("changes to unselect all", () =>{
            expectSelectAllToChangeToUnselectAll(wrapper);
        })
    })
    describe("when 'Unselect all' is selected", () => {
        it("unselects all questionnaires", () =>{
            expectUnselectAllToUnselectAllQuestionnaires(wrapper, questionnairesReturned)
        })
        it("changes to select all", () =>{
            expectUnselectAllToChangeSelectAll(wrapper);
        })
    })
    afterAll(() => {
        cleanup();
    });
})

function expectSelectAllToBeDefined(wrapper: RenderResult){
    expect(wrapper.queryByText("Select all")).toBeDefined();
}

function expectAvailableQuestionnairesToBeDefined(wrapper: RenderResult){
    expect(wrapper.queryByText("LMS2101_AA1")).toBeDefined();
    expect(wrapper.queryByText("LMS2101_BB1")).toBeDefined();
}

function expectRadioButtonsForEachQuestionnaireToBeDefined(wrapper: RenderResult, questionnairesReturned: string[]){
    questionnairesReturned.forEach(function(questionnaire){
        expect(wrapper.getByText(questionnaire)).toBeDefined();
    })
}
function expectTickWhenAQuestionnaireIsSelected(wrapper: RenderResult){
    const checkBox = wrapper.getByText("LMS2101_AA1");
    fireEvent.click(checkBox);
    expect(checkBox).toBeChecked;
}

async function expectSelectAllToSelectAllQuestionnaires(wrapper: RenderResult, questionnairesReturned: string[]){
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
    });
    questionnairesReturned.forEach((questionnaire) => {
        expect(wrapper.getByText(questionnaire)).toBeChecked();
    })
}

async function expectSelectAllToChangeToUnselectAll(wrapper: RenderResult) {
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
    });
    expect(wrapper.getByText("Unselect all")).toBeVisible();
}

async function expectUnselectAllToUnselectAllQuestionnaires(wrapper: RenderResult, questionnairesReturned: string[]) {
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
        fireEvent.click(await screen.findByText(/Unselect all/));
    });
    questionnairesReturned.forEach((questionnaire) => {
        expect(wrapper.getByText(questionnaire)).not.toBeChecked();
    })
}

async function expectUnselectAllToChangeSelectAll(wrapper: RenderResult) {
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
        fireEvent.click(await screen.findByText(/Unselect all/));
    });
    expect(wrapper.getByText("Select all")).toBeVisible();
}
