import BlaiseApiClient, {NewUser} from "blaise-api-node-client";
import {v4 as uuidv4} from "uuid";

export async function setupTestUser(blaiseApiClient: BlaiseApiClient, serverPark :string): Promise<NewUser> {
    await connectToRestApi(blaiseApiClient);
    const password = uuidv4();
    const userName = `dst-test-user-${uuidv4()}`;
    const user = {
        password: password,
        name: userName,
        role: "DST",
        serverParks: [
            serverPark
        ],
        defaultServerPark: serverPark
    };

    try {
        return await blaiseApiClient.createUser(user);
    } catch (error) {
        console.error(`Failed to create user: ${error}`);
        throw(error);
    }
}

export async function setupInstrument(blaiseApiClient: BlaiseApiClient, instrumentName: string, serverPark: string): Promise<void> {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    await connectToRestApi(blaiseApiClient);
    await installInstrument(blaiseApiClient, serverPark, instrumentName);
    await addSurveyDays(blaiseApiClient, serverPark, today, tomorrow, instrumentName);
    await addDaybatch(blaiseApiClient, serverPark, today, instrumentName);
}

async function connectToRestApi(blaiseApiClient: BlaiseApiClient) {
    try {
        await blaiseApiClient.getDiagnostics();
    } catch (error) {
        console.error(`Failed to connect to the rest-api: ${error}`);
        throw(error);
    }
}

async function installInstrument(blaiseApiClient: BlaiseApiClient, serverPark: string, instrumentName: string) {
    try {
        await blaiseApiClient.installInstrument(serverPark, {instrumentFile: `${instrumentName}.bpkg`});
        for (let attempts = 0; attempts <= 12; attempts++) {
            const instrumentDetails = await blaiseApiClient.getInstrument(serverPark, `${instrumentName}`);
            if (instrumentDetails.status == "Active") {
                break;
            } else {
                console.log(`Instrument ${instrumentName} is not active, waiting to add cases`);
                await new Promise(f => setTimeout(f, 10000));
            }
        }
        for (let caseID = 1; caseID <= 10; caseID++) {
            const caseFields = {
                "qdatabag.telno": "07000 000 000",
                "qdatabag.telno2": "07000 000 000",
                "qdatabag.samptitle": "title",
                "qdatabag.sampfname": "fname",
                "qdatabag.sampsname": "sname",
                "qdatabag.name": "name"
            };
            await blaiseApiClient.addCase(serverPark, `${instrumentName}`, caseID.toString(), caseFields);
        }
    } catch (error) {
        console.error(`Failed to install instrument: ${error}`);
        throw(error);
    }
}

async function addSurveyDays(blaiseApiClient: BlaiseApiClient, serverPark: string, today: Date, tomorrow: Date, instrumentName: string) {
    try {
        await blaiseApiClient.addSurveyDays(serverPark, `${instrumentName}`, [today.toISOString(), tomorrow.toISOString()]);
    } catch (error) {
        console.error(`Failed to add survey days: ${error}`);
        throw(error);
    }
}

async function addDaybatch(blaiseApiClient: BlaiseApiClient, serverPark: string, today: Date, instrumentName: string) {
    try {
        await blaiseApiClient.addDaybatch(serverPark, `${instrumentName}`, {
            dayBatchDate: today.toISOString(),
            checkForTreatedCases: false
        });
    } catch (error) {
        console.error(`Failed to add daybatch: ${error}`);
        throw(error);
    }
}
