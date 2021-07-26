import React, {ReactElement, useEffect, useState} from "react";
import {DefaultErrorBoundary} from "./components/ErrorHandling/DefaultErrorBoundary";
import {Link, Route, Switch} from "react-router-dom";
import {BetaBanner, Footer, Header, ONSPanel} from "blaise-design-system-react-components";
import InterviewerCallHistory from "./reports/InterviewerCallHistory";
import InterviewerCallPattern from "./reports/InterviewerCallPattern";
import {getInterviewerCallHistoryStatus} from "./utilities/http";
import dateFormatter from "dayjs";
import TimeAgo from "react-timeago";

const divStyle = {
    minHeight: "calc(67vh)"
};

function App(): ReactElement {
    const [reportStatus, setReportStatus] = useState<Date | "">("");

    useEffect(() => {
        getInterviewerCallHistoryStatus().then(([success, last_updated]) => {
            console.log(last_updated.last_updated);
            if (!success) {
                return;
            }
            setReportStatus(new Date(last_updated.last_updated));
        });
    }, []);


    return (
        <>
            <BetaBanner/>
            <Header title={"Management Information Reports"}/>
            <div style={divStyle} className="page__container container">
                <main id="main-content" className="page__main">
                    <DefaultErrorBoundary>
                        <Switch>
                            <Route path="/interviewer-call-history">
                                <InterviewerCallHistory/>
                            </Route>
                            <Route path="/interviewer-call-pattern">
                                <InterviewerCallPattern/>
                            </Route>
                            <Route path="/">
                                {
                                    status !== "" &&
                                    <ONSPanel status={status?.includes("success") ? "success" : "error"}>
                                        <p>{status}</p>
                                    </ONSPanel>
                                }
                                <ONSPanel>
                                    <p aria-live="polite">
                                        Data in these reports was last updated: <b>
                                        {<TimeAgo live={false} date={reportStatus}/>}
                                        {(reportStatus ? "" + dateFormatter(reportStatus).tz("Europe/London").format(" (DD/MM/YYYY HH:mm:ss)"): "Loading")}</b>.
                                    </p>
                                    <p>
                                        These reports only go back to the last 12 months.
                                    </p>
                                </ONSPanel>
                                <br/>
                                <div className="grid grid--column@xxs@s u-mt-m">
                                    <div className="grid__col col-6@m">
                                        <div className="card" aria-labelledby="interviewer-call-history"
                                             aria-describedby="interviewer-call-history-text">
                                            <h2 className="u-fs-m" id="interviewer-call-history">
                                                <Link to="/interviewer-call-history">
                                                    Interviewer Call History
                                                </Link>
                                            </h2>
                                            <p id="interviewer-call-history-text">Generate report to see an interviewers
                                                call history over a given date range.</p>
                                        </div>
                                    </div>
                                    <div className="grid__col col-6@m">
                                        <div className="card" aria-labelledby="interviewer-call-pattern"
                                             aria-describedby="interviewer-call-pattern-text">
                                            <h2 className="u-fs-m" id="interviewer-call-pattern">
                                                <Link to="/interviewer-call-pattern">
                                                    Interviewer Call Pattern
                                                </Link>
                                            </h2>
                                            <p id="interviewer-call-pattern-text">Generate report to analyse
                                                productivity of an interviewer over a given date range.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid--column@xxs@s  u-mt-m">
                                    {/* TODO: Removed as the report does not exist yet, to add back in */}
                                    {/*<div className="grid__col col-6@m">*/}
                                    {/*    <div className="card" aria-labelledby="appointment-resource-planning"*/}
                                    {/*         aria-describedby="appointment-resource-planning-text">*/}
                                    {/*        <h2 className="u-fs-m" id="appointment-resource-planning">*/}
                                    {/*            <Link to="/appointment-resource-planning">*/}
                                    {/*                Daily Appointment Resource Planning*/}
                                    {/*            </Link>*/}
                                    {/*        </h2>*/}
                                    {/*        <p id="appointment-resource-planning-text">Generate report to view the*/}
                                    {/*            number of interview appointments scheduled for a specified date.</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </Route>
                        </Switch>
                    </DefaultErrorBoundary>
                </main>
            </div>
            <Footer/>
        </>
    );
}

export default App;
