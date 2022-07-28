import React, { ReactElement } from "react";
import { formatDate } from "../utilities/DateFormatter";

interface FilterSummaryProps{
    interviewer: string
    startDate: Date
    endDate: Date
    questionnaires: string[]
}

function FilterSummary(FilterSummaryProps: FilterSummaryProps): ReactElement {
    if (FilterSummaryProps.questionnaires.length > 0) {
        return (
            <>
                <h3 className="u-mb-m">
                Interviewer: {FilterSummaryProps.interviewer} <br></br>
                Period: {formatDate(FilterSummaryProps.startDate)}–{formatDate(FilterSummaryProps.endDate)}<br></br>
                Questionnaire{FilterSummaryProps.questionnaires.length > 1 ? ("s") : ""}: 
                    {formatList(FilterSummaryProps.questionnaires)}
                </h3>
            </>
        );
    } return (
        <>
            <h3 className="u-mb-m">
            Interviewer: {FilterSummaryProps.interviewer} <br></br>
            Period: {formatDate(FilterSummaryProps.startDate)}–{formatDate(FilterSummaryProps.endDate)}<br></br>
            </h3>
        </>
    );
}

function formatList(listOfQuestionnaires: string[]): string {
    if (listOfQuestionnaires.length === 1) return listOfQuestionnaires[0];
    const firsts = listOfQuestionnaires.slice(0, listOfQuestionnaires.length - 1);
    const last = listOfQuestionnaires[listOfQuestionnaires.length - 1];
    return firsts.join(", ") + " and " + last;
}

export default FilterSummary;