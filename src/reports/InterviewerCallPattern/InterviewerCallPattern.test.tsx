/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {
    callStatusSection,
    formatToFractionAndPercentage,
    invalidFieldsGroup,
    isAllInvalid,
    noContactBreakdownSection
} from "./RenderInterviewerCallPatternReport";
import { InterviewerCallPatternReport } from "../../interfaces";

const mockDataWithInvalidCases: InterviewerCallPatternReport = {
    total_valid_cases: 133,
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: 5.66,
    average_calls_per_hour: 3.86,
    refusals: 4,
    completed_successfully: 0,
    appointments_for_contacts: 81,
    web_nudge: 5,
    discounted_invalid_cases: 29,
    no_contacts: 11,
    no_contact_answer_service: 4,
    no_contact_busy: 1,
    no_contact_disconnect: 2,
    no_contact_no_answer: 3,
    no_contact_other: 4,
    invalid_fields: "'status' column had timed out call status,'call_end_time' column had missing data",
    total_records: 133 + 29,
};

const mockDataWithOnlyInvalidCases: InterviewerCallPatternReport = {
    discounted_invalid_cases: 100,
    invalid_fields: "'status' column had timed out call status,'call_end_time' column had missing data"
};

const mockData: InterviewerCallPatternReport = {
    total_valid_cases: 133,
    hours_worked: "26:58:07",
    call_time: "01:31:32",
    hours_on_calls_percentage: 5.66,
    average_calls_per_hour: 3.86,
    refusals: 4,
    completed_successfully: 0,
    appointments_for_contacts: 81,
    web_nudge: 5,
    no_contacts: 11,
    no_contact_answer_service: 4,
    no_contact_busy: 1,
    no_contact_disconnect: 2,
    no_contact_no_answer: 3,
    no_contact_other: 4,
    invalid_fields: "n/a",
    discounted_invalid_cases: 0,
};

describe("function formatToFractionAndPercentage()", () => {
    it("should return a string demonstrating the total and percentage", () => {
        const actual = formatToFractionAndPercentage(1, 2);
        expect(actual).toEqual("1/2, 50.00%");
    });
});

describe("function callStatusSection()", () => {
    it("should return the relevant section from data", () => {
        const callSection = callStatusSection(mockDataWithInvalidCases);
        expect(callSection).toEqual({
            "records": {
                "refusals": "4/133, 3.01%",
                "completed_successfully": "0/133, 0.00%",
                "appointments_for_contacts": "81/133, 60.90%",
                "web_nudge": "5/133, 3.76%",
                "no_contacts": "11/133, 8.27%",
                "discounted_invalid_cases": "29/162, 17.90%",
            },
            "title": "Call status",
        });
    });
});

describe("function callStatusSection()", () => {
    it("should return the relevant section from data", () => {
        const callSection = callStatusSection(mockDataWithInvalidCases);
        expect(callSection).toEqual({
            "records": {
                "refusals": "4/133, 3.01%",
                "completed_successfully": "0/133, 0.00%",
                "appointments_for_contacts": "81/133, 60.90%",
                "web_nudge": "5/133, 3.76%",
                "no_contacts": "11/133, 8.27%",
                "discounted_invalid_cases": "29/162, 17.90%",
            },
            "title": "Call status",
        });
    });
});

describe("function noContactBreakdownSection()", () => {
    it("should return the relevant section from data", () => {
        const callSection = noContactBreakdownSection(mockDataWithInvalidCases);
        expect(callSection).toEqual({
            "records": {
                "answer_service": "4/11, 36.36%",
                "busy": "1/11, 9.09%",
                "disconnect": "2/11, 18.18%",
                "no_answer": "3/11, 27.27%",
                "other": "4/11, 36.36%",
            },
            "title": "Breakdown of No Contact calls",
        });
    });
});

describe("function invalidFieldsGroup()", () => {
    it("should return the required information to display in an information panel", () => {
        const invalidPanel = invalidFieldsGroup(mockDataWithInvalidCases);
        expect(invalidPanel).toEqual({
            "records": {
                "invalid_fields": "'status' column had timed out call status,'call_end_time' column had missing data",
                "discounted_invalid_cases": 29,
                "total_records": (mockDataWithInvalidCases.total_valid_cases || 0) + mockDataWithInvalidCases.discounted_invalid_cases,
            },
            "title": "Invalid Fields",
        });
    });
});

describe("function isAllInvalid()", () => {
    it("should return true if data does not have total_valid_cases", () => {
        const expectTrue = isAllInvalid(mockDataWithOnlyInvalidCases);
        expect(expectTrue).toEqual(true);
    });

    it("should return false if data has total_valid_cases", () => {
        const expectFalse = isAllInvalid(mockData);
        expect(expectFalse).toEqual(false);
    });
});
