import React, { ReactElement, useEffect, useState, Fragment } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthManager } from "blaise-login-react-client";
import {
    FormFieldObject,
    ONSLoadingPanel,
    ONSPanel,
    StyledForm
} from "blaise-design-system-react-components";
import AppointmentResourceDaybatchWarning from "../AppointmentResourcePlanning/AppointmentResourceDaybatchWarning";
import { formatDate, formatISODate, isoDateFormat } from "../../utilities/DateFormatter";

interface AppointmentQuestionnaireFilterPageProps {
    reportDate: Date
    surveyTla: string
    questionnaire: string[]
    setQuestionnaires: (string: string[]) => void
    submitFunction: () => void
    navigateBack: () => void
}

function axiosConfig(): AxiosRequestConfig {
    const authManager = new AuthManager();
    return {
        headers: authManager.authHeader()
    };
}

function AppointmentQuestionnaireFilter(props: AppointmentQuestionnaireFilterPageProps): ReactElement {
    const [messageNoData, setMessageNoData] = useState<string>("");
    const [fields, setFields] = useState<FormFieldObject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [numberOfQuestionnaires, setNumberOfQuestionnaires] = useState(0);
    const {
        reportDate,
        surveyTla,
        submitFunction,
        navigateBack,
        questionnaire,
        setQuestionnaires,
    } = props;

    useEffect(() => {
        getQuestionnaireList().then(setupForm);
    }, []
    );

    function setupForm(allQuestionnaires: string[]) {
        setFields([
            {
                name: "questionnaires",
                type: "checkbox",
                initial_value: questionnaire,
                checkboxOptions: allQuestionnaires.map(name => ({
                    id: name,
                    value: name,
                    label: name,
                })),
            },
        ]);
        setNumberOfQuestionnaires(allQuestionnaires.length);
        setIsLoading(false);
    }

    async function getQuestionnaireList(): Promise<string[]> {
        const url = "/api/appointments/questionnaires";
    
        const formData = new FormData();
        setMessageNoData("");
        formData.append("survey_tla", surveyTla);
        formData.append("date", formatISODate(reportDate));

        return axios.post(url, formData, axiosConfig()).then((response: AxiosResponse) => {
            console.log(`Response: Status ${response.status}, data ${response.data}`);
            if (response.data === 0) {
                setMessageNoData("No data found for parameters given.");
                return;
            }
            if (response.status === 200) {
                return response.data;
            }
            throw ("Response was not 200");
        }).catch((error: Error) => {
            console.error(`Response: Error ${error} - URL: ${url}`);
            throw error;
        });
    }

    function handleSubmit(values: any) {
        setQuestionnaires(values["questionnaires"]);
        submitFunction();
    }

    function displayCheckboxes() {
        if (isLoading) {
            return <ONSLoadingPanel/>;
        }
        if (numberOfQuestionnaires === 0) {
            return <ONSPanel> No questionnaires found for given parameters.</ONSPanel>;
        }
        return <StyledForm fields={fields} submitLabel="Run report" onSubmitFunction={handleSubmit}/>;
    }

    return (
        <>
            <div>
                <Breadcrumbs
                    BreadcrumbList={[{ link: "/", title: "Reports" }, {
                        link: "#",
                        onClickFunction: navigateBack,
                        title: "Appointment Details"
                    }]}/>

                <main id="main-content" className="page__main u-mt-s">
                    
                    <h1 className="u-mb-m">Select questionnaires for </h1>
                    <h3 className="u-mb-m">
                        Date: {formatDate(reportDate)}
                    </h3>
                    <AppointmentResourceDaybatchWarning/>
                    <br/>
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

export default AppointmentQuestionnaireFilter;
