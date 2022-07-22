import subtractYears from "./DateFormatter";

test("test date returned is 1 year less than date given", () => {
    const date = new Date("1990-06-30");
    expect(String(subtractYears(1, date)) == "1989-06-30");
});
