export function SurveyField(surveyTLA: string | undefined): Record<string, any> {
    return {
        name: "Survey TLA",
        description: "Select survey",
        type: "radio",
        initial_value: surveyTLA,
        radioOptions: [
            { id: "all", value: "", label: "Show all surveys" },
            { id: "lms", value: "lms", label: "LMS", description: "Labour Market Survey" },
            { id: "opn", value: "opn", label: "OPN", description: "Opinions and Lifestyle Survey" }
        ]
    };
}
