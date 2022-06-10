import {StyledForm} from "blaise-design-system-react-components";
import React, {ReactElement} from "react";
import dateFormatter from "dayjs";
import Breadcrumbs from "../../components/Breadcrumbs";
import AppointmentResourceDaybatchWarning from "../AppointmentResourcePlanning/AppointmentResourceDaybatchWarning";

interface AppointmentFilterPageProps {
    title: string
    reportDate: Date
    setReportDate: (Date: Date) => void
    surveyTla: string | undefined
    setSurveyTla: (string: string) => void
    submitFunction: () => void;
}

function AppointmentFilter(props: AppointmentFilterPageProps): ReactElement {
    const {
        title,
        reportDate,
        setReportDate,
        surveyTla,
        setSurveyTla,
        submitFunction
    } = props;

    async function submitAppointmentFilters(formValues: Record<string, any>, setSubmitting: (isSubmitting: boolean) => void): Promise<void> {
        setReportDate(formValues["Date"]);
        setSurveyTla(formValues["Survey TLA"]);
        setSubmitting(true);
        submitFunction();
    }

    const validateDate = (value: string) => {
        if (value === "" || value === undefined) {
            return "Enter a date";
        }

        if (value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) === null) {
            return "Enter a valid date";
        }
    };

    const fields = [
        {
            name: "Survey TLA",
            description: "Select survey",
            type: "radio",
            initial_value: surveyTla,
            radioOptions: [
                {id: "all", value: "", label: "Show all surveys"},
                {id: "lms", value: "lms", label: "LMS", description: "Labour Market Survey"},
                {id: "opn", value: "opn", label: "OPN", description: "Opinions and Lifestyle Survey"}
            ]
        },
        {
            name: "Date",
            type: "date",
            initial_value: dateFormatter(reportDate).format("YYYY-MM-DD"),
            validate: validateDate
        }
    ];


    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={[{link: "/", title: "Reports"}]}/>
                <main id="main-content" className="page__main u-mt-s">
                    <h1 className="u-mb-m">Run {title} report</h1>
                    <AppointmentResourceDaybatchWarning/>
                    <br></br>
                    <StyledForm fields={fields} onSubmitFunction={submitAppointmentFilters} submitLabel={"Next"}/>
                </main>
            </div>
        </>
    );
}

export default AppointmentFilter;