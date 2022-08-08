/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { formatToFractionAndPercentage } from "./RenderInterviewerCallPatternReport";

describe("function formatToFractionAndPercentage()", () => {
    it("should return a string demonstrating the total and percentage", () => {
        const actual = formatToFractionAndPercentage(1, 2);
        expect(actual).toEqual("1/2, 50.00%");
    });
});
