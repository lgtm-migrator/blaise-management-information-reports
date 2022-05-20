import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

interface ReportDetailsProps {
    link: string
    title: string
    description: string
}

function ReportDetails(ReportDetailsProps: ReportDetailsProps): ReactElement {
    return (
        <>
            <div className="grid__col col-6@m">
                <div className="card" aria-labelledby={ReportDetailsProps.link} aria-describedby={`${ReportDetailsProps.link}-text`}>
                    <h2 className="u-fs-m" id={ReportDetailsProps.link}>
                        <Link to={ReportDetailsProps.link}>
                            {ReportDetailsProps.title}
                        </Link>
                    </h2>
                    <p id="interviewer-call-history-text">{ReportDetailsProps.description}</p>
                </div>
            </div>
        </>
    );
}

export default ReportDetails;