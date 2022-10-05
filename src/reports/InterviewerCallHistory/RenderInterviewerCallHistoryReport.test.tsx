import "@testing-library/jest-dom";
import React from "react";
import RenderInterviewerCallHistoryReport from "./RenderInterviewerCallHistoryReport";
import { render, RenderResult, screen, within } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { InterviewerCallHistoryReport } from "../../interfaces";

const http = new MockAdapter(axios);

describe("RenderInterviewerCallHistoryReport", () => {
    let navigateBack: () => void;
    let navigateBackTwoSteps: () => void;
    let history: History<unknown>;

    beforeEach(async () => {
        http.reset();

        history = createMemoryHistory();
        history.push("/interviewer-call-history");

        navigateBack = jest.fn();
        navigateBackTwoSteps = jest.fn();

        http.onGet("/api/reports/call-history-status")
            .reply(200, { "last_updated": "Tue, 04 Oct 2022 00:00:06 GMT" });
    });

    function renderComponent(): RenderResult {
        return render(
            <Router history={ history }>
                <RenderInterviewerCallHistoryReport
                    interviewer="rich"
                    startDate={ new Date("September 18, 2022 01:23:00") }
                    endDate={ new Date("October 17, 2022 04:56:00") }
                    surveyTla="LMS"
                    questionnaires={ ["LMS1111", "LMS2222"] }
                    navigateBack={ navigateBack }
                    navigateBackTwoSteps={ navigateBackTwoSteps }
                />
            </Router>
        );
    }

    it("posts the search parameters to the backend", async () => {
        expect.assertions(5);
        http.onPost(
            "/api/reports/interviewer-call-history",
            {
                // If these don't match then the tests fail with a 404
                asymmetricMatch: (formData: FormData) => {
                    expect(formData.get("survey_tla")).toBe("LMS");
                    expect(formData.get("interviewer")).toBe("rich");
                    expect(formData.get("start_date")).toBe("Sun Sep 18 2022 01:23:00 GMT+0100 (British Summer Time)");
                    expect(formData.get("end_date")).toBe("Mon Oct 17 2022 04:56:00 GMT+0100 (British Summer Time)");
                    expect(formData.get("questionnaires")).toBe("LMS1111,LMS2222");
                    return true;
                }
            }
        ).reply(200, []);
        renderComponent();
        await screen.findByText(/No data found for parameters given/);
    });

    it("displays the call the last updated message", async () => {
        renderComponent();
        await screen.findByText(/Data in this report was last updated:/);
        await screen.findByText(/\(04\/10\/2022 01:00:06\)/);
    });

    it("displays the header", () => {
        renderComponent();
        expect(screen.getByRole("heading", { name: "Call History Report" })).toBeVisible();
    });

    it("navigates to / when Reports is clicked", () => {
        renderComponent();
        userEvent.click(screen.getByRole("link", { name: "Reports" }));
        expect(history.location.pathname).toBe("/");
    });

    it("calls navigateBackTwoSteps when Interview details is clicked", () => {
        renderComponent();
        userEvent.click(screen.getByRole("link", { name: "Interviewer details" }));
        expect(navigateBackTwoSteps).toHaveBeenCalled();
    });

    it("calls navigateBack when Questionnaires is clicked", () => {
        renderComponent();
        userEvent.click(screen.getByRole("link", { name: "Questionnaires" }));
        expect(navigateBack).toHaveBeenCalled();
    });

    it("displays the filter summary", () => {
        renderComponent();
        expect(screen.getByRole("heading", { name: /Interviewer:\s*rich/ })).toBeVisible();
        expect(screen.getByRole("heading", { name: /Period:\s*18\/09\/2022\s*–\s*17\/10\/2022/ })).toBeVisible();
        expect(screen.getByRole("heading", { name: /Questionnaires:\s*LMS1111 and LMS2222/ })).toBeVisible();
    });

    it("displays spinners while the status and report are loading", async () => {
        renderComponent();
        expect(screen.getAllByText("Loading")).toHaveLength(2);
        await screen.findByText("Failed to load");
    });

    describe("when no results are found", () => {
        it("displays the not found message", async () => {
            http.onPost("/api/reports/interviewer-call-history").reply(200, []);
            renderComponent();
            await screen.findByText("No data found for parameters given.");
        });
    });

    describe("when the server returned an error fetching report", () => {
        it("displays the not found message", async () => {
            http.onPost("/api/reports/interviewer-call-history").reply(500, "");
            renderComponent();
            await screen.findByText("Failed to load");
        });
    });

    describe("when error occurred while fetching report", () => {
        it("displays the not found message", async () => {
            http.onPost("/api/reports/interviewer-call-history").reply(() => {
                throw new Error("Boom!");
            });
            renderComponent();
            await screen.findByText("Failed to load");
        });
    });

    describe("when results are loaded", () => {
        beforeEach(async () => {
            const results: InterviewerCallHistoryReport[] = [
                {
                    questionnaire_name: "LMS2202_TX9",
                    serial_number: "101010",
                    call_start_time: "Mon, 01 Aug 2022 01:02:03 GMT",
                    dial_secs: 83,
                    call_result: "Appointment"
                },
                {
                    questionnaire_name: "DST2111Z",
                    serial_number: "202020",
                    call_start_time: "Thu, 06 Jan 2022 04:05:06 GMT",
                    dial_secs: 3,
                    call_result: "Busy"
                },
            ];
            http.onPost("/api/reports/interviewer-call-history").reply(200, results);
            renderComponent();
            await screen.findByRole("columnheader", { name: "Questionnaire" });
        });

        it("displays the CVS link", () => {
            expect(screen.getByText(/Export report as Comma-Separated Values \(CSV\) file/)).toBeVisible();
        });

        it("displays table headings", () => {
            const cells = screen.getAllByRole("columnheader");
            expect(cells[0]).toHaveTextContent("Questionnaire");
            expect(cells[1]).toHaveTextContent("Serial Number");
            expect(cells[2]).toHaveTextContent("Call Start Time");
            expect(cells[3]).toHaveTextContent("Call Length");
            expect(cells[4]).toHaveTextContent("Call Result");
        });

        it("displays the calls", () => {
            const rows = screen.getAllByRole("row");

            const row1 = within(rows[1]).getAllByRole("cell");
            expect(row1[0]).toHaveTextContent("LMS2202_TX9");
            expect(row1[1]).toHaveTextContent("101010");
            expect(row1[2]).toHaveTextContent("01/08/2022 02:02:03"); // BST adds an hour
            expect(row1[3]).toHaveTextContent("01:23");
            expect(row1[4]).toHaveTextContent("Appointment");

            const row2 = within(rows[2]).getAllByRole("cell");
            expect(row2[0]).toHaveTextContent("DST2111Z");
            expect(row2[1]).toHaveTextContent("202020");
            expect(row2[2]).toHaveTextContent("06/01/2022 04:05:06");
            expect(row2[3]).toHaveTextContent("00:03");
            expect(row2[4]).toHaveTextContent("Busy");
        });
    });
});
