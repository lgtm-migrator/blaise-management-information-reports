import { FormFieldObject, ONSLoadingPanel, ONSPanel, StyledForm } from "blaise-design-system-react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { getQuestionnaireList } from "../utilities/HTTP";


interface QuestionnaireSelectorProps{
    interviewer: string
    startDate: Date
    endDate: Date
    surveyTla: string
    questionnaires: string[]
    setQuestionnaires: (string: string[]) => void
    submitFunction: () => void
}

function FetchQuestionnairesError() {
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

type Status = "loading" | "loaded" | "loading_failed";

function QuestionnaireSelector(props: QuestionnaireSelectorProps): ReactElement {
    const [status, setStatus] = useState<Status>("loading");
    const [fields, setFields] = useState<FormFieldObject[]>([]);
    const [numberOfQuestionnaires, setNumberOfQuestionnaires] = useState(0);
    const {
        interviewer,
        startDate,
        endDate,
        surveyTla,
        submitFunction,
        questionnaires,
        setQuestionnaires,
    } = props;

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchQuestionnaires(): Promise<string[]> {
            return getQuestionnaireList(surveyTla, interviewer, startDate, endDate);
        }

        fetchQuestionnaires()
            .then(setupForm)
            .catch((error: Error) => {
                setStatus("loading_failed");
                console.error(`Response: Error ${error}`);
            });
        return () => {
            abortController.abort();
        };
    }, []); 

    function setupForm(allQuestionnaires: string[]) {
        setFields([
            {
                name: "questionnaires",
                type: "checkbox",
                initial_value: questionnaires,
                validate: (values: string[]) => values.length > 0 ? undefined : "At least one questionnaire must be selected",
                checkboxOptions: allQuestionnaires.map(name => ({
                    id: name,
                    value: name,
                    label: name,
                    testid: name
                })),
            },
        ]);
        setNumberOfQuestionnaires(allQuestionnaires.length);
        setStatus("loaded");
    }

    function handleSubmit(values: any) {
        setQuestionnaires(values["questionnaires"]);
        submitFunction();
    }

    function displayCheckboxes() {
        if (status === "loading_failed") {
            return <FetchQuestionnairesError/>;
        }
        if (status === "loading") {
            return <ONSLoadingPanel/>;
        }
        if (numberOfQuestionnaires === 0) {
            return <ONSPanel>No questionnaires found for given parameters.</ONSPanel>;
        }
        return <StyledForm fields={fields} submitLabel="Run report" onSubmitFunction={handleSubmit}/>;
    }

    return (
        <>
            <div className="input-items">
                <div className="checkboxes__items">
                    {displayCheckboxes()}
                </div>
            </div>
        </>
    );
}

export default QuestionnaireSelector;
