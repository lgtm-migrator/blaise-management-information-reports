import React from "react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { render, RenderResult } from "@testing-library/react";
import { Router } from "react-router";
import FilterSummary from "./FilterSummary";
import { act } from "react-dom/test-utils";

describe("FilterSummary tests", () => {
    let wrapper: RenderResult;
    const multipleQuestionnaires: string[] = ["LMS", "OPN"];
    const singleQuestionnaire: string[] = ["LMS"];
    const noQuestionnaires: string[] = [];
    
    beforeEach(async () =>{
        await act(async () => {
            wrapper = renderComponent(noQuestionnaires);
        });
    });

    it("matches snapshot", async () => {
        expect(await wrapper).toMatchSnapshot();
    });

    describe("renders interviewer and period correctly", () => {
        it("displays interviewer and the relevant information", () =>{
            expect(wrapper.getByText(/Interviewer: Cal/)).toBeVisible();
        });
        it("displays period and the relevant information", () =>{
            expect(wrapper.getByText(/Period: 04\/05\/2022–05\/05\/2022/)).toBeVisible();
        });
    });

    describe("renders correctly without questionnaires being filtered", () => {
        it("does not display questionnaire when no questionnaires have been passed through", () =>{
            expect(wrapper.queryByText(/Questionnaire/)).toBeNull();
        });
    });

    describe("it renders correctly when questionnaires are filtered", () => {
        it("displays one questionnaire and the relevant information", () =>{
            wrapper = renderComponent(singleQuestionnaire);
            expect(wrapper.getByText(/Questionnaire:LMS/)).toBeVisible();
        });
        it("displays multiple questionnaires and the relevant information", () =>{
            wrapper = renderComponent(multipleQuestionnaires);
            expect(wrapper.getByText(/Questionnaires:LMS and OPN/)).toBeVisible();
        });
    });
});

function renderComponent(questionnaires: string[]){
    const history = createMemoryHistory();
    return render(
        <Router history={history}>
            <FilterSummary startDate={ new Date("2022-05-04") } endDate={ new Date("2022-05-05") } 
                interviewer="Cal" questionnaires={questionnaires}/>
        </Router>
    );
}