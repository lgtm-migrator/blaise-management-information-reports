import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { Router } from "react-router";
import CallHistoryReportTable from "./CallHistoryReportTable";
import { act } from "react-dom/test-utils";
import React from "react";
import { screen } from "@testing-library/dom";
import flushPromises from "../tests/utilities";

const reportData = {
    appointment_info: "foo",
    busy_dials: "1",
    call_number: "1",
    cohort: "1",
    update_info: "FOO",
    wave: "1",
    questionnaire_id: "LMS",
    interviewer: "James",
    outcome_code: "310",
    dial_number: "1",
    status: "1",
    survey: "LMS",
    call_result: "310",
    dial_secs: "100",
    questionnaire_name: "LMS2101_AA1",
    serial_number: "900001",
    call_start_time: "09:00 31/01/2022"
};
const messageNoData = "No data found for parameters given.";

describe("CallHistoryReportTable", () => {
    it("matches snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CallHistoryReportTable messageNoData={messageNoData} reportData={reportData}/>
            </Router>
        );
        await act(async () => {
            await flushPromises();
        });
        expect(await wrapper).toMatchSnapshot();
    });

    it("displays a heading of 'Questionnaire'", async () => {
        const history = createMemoryHistory();
        await act(async () => {
            render(
                <Router history={history}>
                    <CallHistoryReportTable messageNoData={messageNoData} reportData={reportData}/>
                </Router>
            );
        });
        expect(screen.queryByText("Questionnaire")).toBeVisible();
    });
});

// it(displays a heading of 'Serial number')
// it(displays a heading of 'Call start time')
// it(displays a heading of 'Call length')
// it(displays a heading of 'Call result')
// it(displays a bold line beneath the heading)
// it(displays the relevant information for each heading)
// it(display a line beneath each row)
