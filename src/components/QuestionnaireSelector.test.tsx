/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import QuestionnaireSelector from "./QuestionnaireSelector";
import React from "react";
import { cleanup, render, RenderResult } from "@testing-library/react";
import { fireEvent, screen } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mockAdapter = new MockAdapter(axios);

const questionnairesReturned = ["LMS2101_AA1", "LMS2101_BB1", "LMS2101_CC1"];
describe("QuestionnaireSelector tests", () => {
    let setQuestionnaires: (questionnaires: string[]) => void;
    let submit: () => void;
    let wrapper: RenderResult;
    
    beforeEach(async () =>{
        const axiosMock = new MockAdapter(axios);
        axiosMock.onPost("/api/questionnaires").reply(200, questionnairesReturned);
        setQuestionnaires = jest.fn();
        submit = jest.fn();
        await act(async () => {
            wrapper = renderComponent();
        });
    });

    afterEach(() => {
        mockAdapter.reset();
    });
    
    function renderComponent(){
        return render(
            <QuestionnaireSelector interviewer="Cal"
                startDate={ new Date("2022-05-04") }
                endDate={ new Date("2022-05-05") }
                surveyTla="LMS"
                questionnaires={ questionnairesReturned } 
                setQuestionnaires={ setQuestionnaires }
                submitFunction={ submit }/>
        );
    }

    it("matches snapshot", async () => {
        mockAdapter.onPost("/api/questionnaires").reply(200, questionnairesReturned);
        await screen.findByText("LMS2101_AA1");
        expect(wrapper).toMatchSnapshot();
    });

    describe("it renders correctly", () =>{
        it("displays a 'Select All' button", () => {
            expectSelectAllToBeDefined();
        });
        it("displays all available questionnaires", () =>{
            expectAvailableQuestionnairesToBeDefined(wrapper, questionnairesReturned);
        });
        it("displays all available questionnaires", () =>{
            expectCheckboxesForEachQuestionnaireToBeDefined(wrapper, questionnairesReturned);
        });
    });

    describe("when a questionnaire is selected", () => {
        it("displays a tick in the checkbox", () =>{
            expectTickWhenAQuestionnaireIsSelected(wrapper);
        });
    });

    describe("when 'Select all' is selected", () => {
        it("selects all questionnaires", () =>{
            expectSelectAllToSelectAllQuestionnaires(wrapper, questionnairesReturned);
        });
        it("changes to unselect all", () =>{
            expectSelectAllToChangeToUnselectAll(wrapper);
        });
    });

    describe("when 'Unselect all' is selected", () => {
        it("unselects all questionnaires", () =>{
            expectUnselectAllToUnselectAllQuestionnaires(wrapper, questionnairesReturned);
        });
        it("changes to select all", () =>{
            expectUnselectAllToChangeSelectAll(wrapper);
        });
    });

    afterAll(() => {
        cleanup();
    });
});

function expectSelectAllToBeDefined(){
    expect(screen.getByRole("button", { name: "Unselect All following checkboxes" })).toBeVisible();
}

function expectAvailableQuestionnairesToBeDefined(wrapper: RenderResult, questionnairesReturned: string[]){
    questionnairesReturned.forEach((questionnaire) => {
        expect(wrapper.getByText(questionnaire)).toBeVisible();
    });
}

function expectCheckboxesForEachQuestionnaireToBeDefined(wrapper: RenderResult, questionnairesReturned: string[]){
    questionnairesReturned.forEach((questionnaire) => {
        expect(wrapper.getByRole("checkbox", { name: questionnaire })).toBeVisible();
    });
}
function expectTickWhenAQuestionnaireIsSelected(wrapper: RenderResult){
    const checkBox = wrapper.getByRole("checkbox", { name: "LMS2101_AA1" }, { checked: true });
    fireEvent.click(checkBox);
    expect(wrapper.getByRole("checkbox", { name: "LMS2101_AA1" }, { checked: false }));
}

async function expectSelectAllToSelectAllQuestionnaires(wrapper: RenderResult, questionnairesReturned: string[]){
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
    });
    questionnairesReturned.forEach((questionnaire) => {
        expect(wrapper.getByRole("checkbox", { name: questionnaire }, { checked: true }));
    });
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
        expect(wrapper.getByRole("checkbox", { name: questionnaire }, { checked: false }));
    });
}

async function expectUnselectAllToChangeSelectAll(wrapper: RenderResult) {
    await act(async () => {
        fireEvent.click(await screen.findByText(/Select all/));
        fireEvent.click(await screen.findByText(/Unselect all/));
    });
    expect(wrapper.getByText("Select all")).toBeVisible();
}
