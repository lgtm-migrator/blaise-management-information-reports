import React, {ReactElement, useEffect} from "react";
import {ONSPanel} from "blaise-design-system-react-components";
import ErnieFailed from "./ErnieFailed.jpg";

interface Props {
    error: boolean;
}

const ReportErrorPanel = ({error}: Props): ReactElement => {
    let errorFocus: HTMLDivElement | null;

    useEffect(() => {
        errorFocus?.focus();
    }, [error]);

    if (error) {
        return (
            <div role="alert" ref={input => errorFocus = input} tabIndex={-1}>
                <ONSPanel status="error">
                    <h2>Failed to run the report</h2>
                    <img src={ErnieFailed} alt="Ernie from Sesame Street looking at a computer which displays the text NO" width={350} className="u-mb-s"/>
                    <p>Try again later.</p>
                    <p>If you are still experiencing problems <a href="https://ons.service-now.com/">report this
                        issue</a> to Service Desk</p>
                </ONSPanel>
            </div>
        );
    }

    return (<></>);
};

export default ReportErrorPanel;
