/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import flushPromises from "../tests/utilities";
import { createMemoryHistory } from "history";
import { cleanup, render, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import SurveyDateForm from "./SurveyDateForm";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";
import React from "react";
import MockDate from "mockdate";

const christmasEve97 = "1997-12-24";

describe("form - survey, date", () => {
    afterEach(() => {
        MockDate.reset();
    });

    beforeEach(() => {
        MockDate.set(new Date(christmasEve97));
    });

    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <SurveyDateForm onSubmitFunction="" />
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
                    <SurveyDateForm onSubmitFunction="" />
                </Router>
            );
        });
        expect(screen.queryByText("Select survey")).toBeVisible();
        expect(screen.queryByText("Show all surveys")).toBeVisible();
        expect(screen.queryByText("LMS")).toBeVisible();
        expect(screen.queryByText("Labour Market Survey")).toBeVisible();
        expect(screen.queryByText("OPN")).toBeVisible();
        expect(screen.queryByText("Opinions and Lifestyle Survey")).toBeVisible();
        expect(screen.queryByText("Date")).toBeVisible();
        expect(screen.queryByText("Run")).toBeVisible();

    });
    afterAll(() => {
        cleanup();
    });
});
