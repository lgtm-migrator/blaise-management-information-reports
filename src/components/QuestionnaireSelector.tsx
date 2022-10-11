import { ONSPanel, StyledForm } from "blaise-design-system-react-components";
import React, { ReactElement, useCallback } from "react";
import { getQuestionnaireList } from "../utilities/HTTP";
import { LoadData } from "./LoadData";
import { InterviewerFilterQuery } from "../reports/filters/InterviewerFilter";

interface QuestionnaireSelectorProps{
    interviewerFilterQuery: InterviewerFilterQuery
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
    interviewerFilterQuery,
    questionnaires,
    setQuestionnaires,
    submitFunction,
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

    const errorMessage = useCallback(() => <FetchQuestionnairesError/>, []);

    return (
        <>
            <div className="input-items">
                <div className="checkboxes__items">
                    <LoadData
                        dataPromise={getQuestionnaireList(
                            interviewerFilterQuery.surveyTla,
                            interviewerFilterQuery.interviewer,
                            interviewerFilterQuery.startDate,
                            interviewerFilterQuery.endDate
                        )}
                        errorMessage={errorMessage}
                    >
                        {(fields) => displayCheckboxes(fields)}
                    </LoadData>
                </div>
            </div>
        </>
    );
}

export default QuestionnaireSelector;
