import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getInstrumentList } from "./Reports";

describe("getInstrumentList", () => {
    const mockAdapter = new MockAdapter(axios);

    afterEach(() => {
        mockAdapter.reset();
    });

    it("posts the search parameters", async () => {
        expect.assertions(4);
        mockAdapter.onPost(
            "/api/instruments",
            {
                asymmetricMatch: (formData: FormData) => {
                    expect(formData.get("survey_tla")).toBe("DST");
                    expect(formData.get("interviewer")).toBe("James");
                    expect(formData.get("start_date")).toBe("2022-01-02");
                    expect(formData.get("end_date")).toBe("2022-02-05");
                    return true;
                }
            }
        ).reply(200, []);

        await getInstrumentList("DST", "James", new Date("2022-01-02"), new Date("2022-02-05"));
    });

    it("returns the instruments", async () => {
        mockAdapter.onPost("/api/instruments").reply(200, ["INST_01", "INST_02"]);
        expect(await getInstrumentList(
            "DST",
            "James",
            new Date("2022-01-02"),
            new Date("2022-02-05")
        )).toEqual(["INST_01", "INST_02"]);
    });

    it("rejects when error status is returned", async () => {
        mockAdapter.onPost("/api/instruments").reply(500, "error");
        expect.assertions(1);
        try {
            await getInstrumentList(
                "DST",
                "James",
                new Date("2022-01-02"),
                new Date("2022-02-05")
            );
        } catch (e) {
            expect(e.message).toBe("Request failed with status code 500");
        }
    });

    it("rejects when error status is not 200", async () => {
        mockAdapter.onPost("/api/instruments").reply(201, "error");
        expect.assertions(1);
        try {
            await getInstrumentList(
                "DST",
                "James",
                new Date("2022-01-02"),
                new Date("2022-02-05")
            );
        } catch (e) {
            expect(e.message).toBe("Response was not 200");
        }
    });
});
