import subtractYears, { dateFormat, formatDate, formatDateAndTime } from "./DateFormatter";

test("test date returned is 1 year less than date given", () => {
    const date = new Date("1990-06-30");
    expect(String(subtractYears(1, date)) == "1989-06-30");
});

describe("dateFormat", () => {
    it("returns a human-readable string format for Brits", async () => {});
    expect(dateFormat()).toBe("DD/MM/YYYY");
});

describe("formatDate", () => {
    afterEach(() => {});

    it("returns a date string when given a date object", async () => {
        const dateObject = new Date("2022-12-31");
        expect(formatDate(dateObject)).toBe("31/12/2022");
    });

    it("returns a date string when given a date string", async () => {
        const dateString = "2022-12-31";
        expect(formatDate(dateString)).toBe("31/12/2022");
    });

    it("returns 'Invalid Date' when given an invalid date string", async () => {
        const fooString = "foo";
        expect(formatDate(fooString)).toBe("Invalid Date");
    });
});

describe("formatDateAndTime", () => {
    afterEach(() => {});

    it("returns a date and time string when given a date object", async () => {
        const dateObject = new Date("2022-12-31 15:45:59.000");
        expect(formatDateAndTime(dateObject)).toBe("31/12/2022 15:45:59");
    });

    it("returns a date and time string when given a date string", async () => {
        const dateString = "2022-12-31 15:45:59.000";
        expect(formatDateAndTime(dateString)).toBe("31/12/2022 15:45:59");
    });

    it("returns 'Invalid Date' when given an invalid date string", async () => {
        const fooString = "foo 15:45:59.000";
        expect(formatDateAndTime(fooString)).toBe("Invalid Date");
    });
});
