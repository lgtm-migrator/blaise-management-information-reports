import React, {ReactElement, useEffect, useState, Fragment} from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import dateFormatter from "dayjs";
import {
    FormFieldObject,
    ONSLoadingPanel,
    ONSPanel,
    StyledForm
} from "blaise-design-system-react-components";
import CallHistoryLastUpdatedStatus from "../../components/CallHistoryLastUpdatedStatus";
import { getInstrumentList } from "../../utilities/HTTP";

interface InstrumentFilterPageProps {
    interviewer: string
    startDate: Date
    endDate: Date
    surveyTla: string
    instruments: string[]
    setInstruments: (string: string[]) => void
    submitFunction: () => void
    navigateBack: () => void
}

function FetchInstrumentsError() {
    return (
        <div role="alert">
            <ONSPanel status="error">
                <h2>An error occurred while fetching the list of questionnaires</h2>
                <p>Try again later.</p>
                <p>If you are still experiencing problems <a href="https://ons.service-now.com/">report this
                    issue</a> to Service Desk</p>
            </ONSPanel>
        </div>
    );
}

type Status = "loading" | "loaded" | "loading_failed"

function InstrumentFilter(props: InstrumentFilterPageProps): ReactElement {
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [status, setStatus] = useState<Status>("loading");
    const [fields, setFields] = useState<FormFieldObject[]>([]);
    const [numberOfInstruments, setNumberOfInstruments] = useState(0);
    const {
        interviewer,
        startDate,
        endDate,
        surveyTla,
        submitFunction,
        navigateBack,
        instruments,
        setInstruments,
    } = props;


    useEffect(() => {
        async function fetchInstruments(): Promise<string[]> {
            const instruments = await getInstrumentList(surveyTla, interviewer, startDate, endDate);
            if (instruments.length === 0) {
                setMessageNoData("No data found for parameters given.");
            }
            return instruments;
        }

        setMessageNoData("");

        fetchInstruments()
            .then(setupForm)
            .catch((error: Error) => {
                setStatus("loading_failed");
                console.error(`Response: Error ${error}`);
            });
    }, []);

    function setupForm(allInstruments: string[]) {
        setFields([
            {
                name: "questionnaires",
                type: "checkbox",
                initial_value: instruments,
                validate: (values: string[]) => values.length > 0 ? undefined : "At least one questionnaire must be selected",
                checkboxOptions: allInstruments.map(name => ({
                    id: name,
                    value: name,
                    label: name,
                })),
            },
        ]);
        setNumberOfInstruments(allInstruments.length);
        setStatus("loaded");
    }

    function handleSubmit(values: any) {
        setInstruments(values["questionnaires"]);
        submitFunction();
    }

    function displayCheckboxes() {
        if (status === "loading_failed") {
            return <FetchInstrumentsError/>;
        }
        if (status === "loading") {
            return <ONSLoadingPanel/>;
        }
        if (numberOfInstruments === 0) {
            return <ONSPanel>No questionnaires found for given parameters.</ONSPanel>;
        }
        return <StyledForm fields={fields} submitLabel="Run report" onSubmitFunction={handleSubmit}/>;
    }

    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={[{link: "/", title: "Reports"}, {
                        link: "#",
                        onClickFunction: navigateBack,
                        title: "Interviewer details"
                    }]}/>

                <main id="main-content" className="page__main u-mt-s">
                    {/*<h1 className="u-mb-m">Select questionnaires for <em className="highlight">{interviewer}</em>,*/}
                    {/*    between <em className="highlight">{dateFormatter(startDate).format("DD/MM/YYYY")}</em> and <em*/}
                    {/*        className="highlight">{dateFormatter(endDate).format("DD/MM/YYYY")}</em>*/}
                    {/*</h1>*/}
                    <h1>Select questionnaires for</h1>
                    <h3 className="u-mb-m">
                        Interviewer: {interviewer}<br></br>
                        Period: {dateFormatter(startDate).format("DD/MM/YYYY")}–{dateFormatter(endDate).format("DD/MM/YYYY")}
                    </h3>
                    <CallHistoryLastUpdatedStatus/>

                    <div className="input-items">
                        <div className="checkboxes__items">
                            {displayCheckboxes()}
                        </div>
                    </div>
                </main>

                <ONSPanel hidden={messageNoData === "" && true}>{messageNoData}</ONSPanel>
            </div>
        </>
    );
}

export default InstrumentFilter;
