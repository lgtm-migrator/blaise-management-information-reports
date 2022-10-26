import { ONSPanel, StyledForm } from "blaise-design-system-react-components";
import React, { ReactElement } from "react";

interface QuestionnaireSelectorProps {
    questionnaires: string[];
    selectedQuestionnaires: string[];
    setSelectedQuestionnaires: (string: string[]) => void;
    onSubmit: () => void;
}

function QuestionnaireSelector({
    questionnaires,
    selectedQuestionnaires,
    setSelectedQuestionnaires,
    onSubmit,
}: QuestionnaireSelectorProps): ReactElement {
    function handleSubmit(values: any) {
        setSelectedQuestionnaires(values.questionnaires);
        onSubmit();
    }

    function displayCheckboxes(items: string[]) {
        if (items.length === 0) {
            return <ONSPanel>No questionnaires found for given parameters.</ONSPanel>;
        }

        const fields = [
            {
                name: "questionnaires",
                type: "checkbox",
                initial_value: selectedQuestionnaires,
                validate: (values: string[]) => (values.length > 0 ? undefined : "At least one questionnaire must be selected"),
                checkboxOptions: items.map((name) => ({
                    id: name,
                    value: name,
                    label: name,
                    testid: name,
                })),
            },
        ];

        return <StyledForm fields={fields} submitLabel="Run report" onSubmitFunction={handleSubmit} />;
    }

    return (
        <div className="input-items">
            <div className="checkboxes__items">
                { displayCheckboxes(questionnaires) }
            </div>
        </div>
    );
}

export default QuestionnaireSelector;
