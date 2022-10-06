import { ONSPanel, StyledForm } from "blaise-design-system-react-components";
import React, { ReactElement } from "react";
import { getQuestionnaireList } from "../utilities/HTTP";
import { LoadData } from "./LoadData";

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
        <>
            <h2>An error occurred while fetching the list of questionnaires</h2>
            <p>Try again later.</p>
            <p>If you are still experiencing problems <a href="https://ons.service-now.com/">report this
                issue</a> to Service Desk</p>
        </>
    );
}

function QuestionnaireSelector({
    endDate,
    interviewer,
    questionnaires,
    setQuestionnaires,
    startDate,
    submitFunction,
    surveyTla
}: QuestionnaireSelectorProps): ReactElement {

    function handleSubmit(values: any) {
        setQuestionnaires(values["questionnaires"]);
        submitFunction();
    }

    function displayCheckboxes(results: string[]) {
        if (results.length === 0) {
            return <ONSPanel>No questionnaires found for given parameters.</ONSPanel>;
        }

        const fields = [
            {
                name: "questionnaires",
                type: "checkbox",
                initial_value: questionnaires,
                validate: (values: string[]) => values.length > 0 ? undefined : "At least one questionnaire must be selected",
                checkboxOptions: results.map(name => ({
                    id: name,
                    value: name,
                    label: name,
                    testid: name
                })),
            },
        ];

        return <StyledForm fields={fields} submitLabel="Run report" onSubmitFunction={handleSubmit}/>;
    }

    return (
        <>
            <div className="input-items">
                <div className="checkboxes__items">
                    <LoadData
                        dataPromise={getQuestionnaireList(surveyTla, interviewer, startDate, endDate)}
                        errorMessage={() => <FetchQuestionnairesError/>}
                    >
                        {(fields) => displayCheckboxes(fields)}
                    </LoadData>
                </div>
            </div>
        </>
    );
}

export default QuestionnaireSelector;
