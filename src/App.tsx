import React, {ReactElement} from "react";
import {DefaultErrorBoundary} from "./components/ErrorHandling/DefaultErrorBoundary";
import {Link, Route, Switch} from "react-router-dom";
import {BetaBanner, Footer, Header} from "blaise-design-system-react-components";
import InterviewerCallHistory from "./reports/InterviewerCallHistory";
import InterviewerCallPattern from "./reports/InterviewerCallPattern";

const divStyle = {
    minHeight: "calc(72vh)"
};

function App(): ReactElement {
    return (
        <>
            <a className="skip__link" href="#main-content">Skip to main content</a>
            <BetaBanner/>
            <Header title={"Management Information Reports"}/>
            <div style={divStyle} className="page__container container">
                <DefaultErrorBoundary>
                    <Switch>
                        <Route path="/interviewer-call-history">
                            <InterviewerCallHistory/>
                        </Route>
                        <Route path="/interviewer-call-pattern">
                            <InterviewerCallPattern/>
                        </Route>
                        <Route path="/">
                            <main id="main-content" className="page__main u-mt-no">
                                <h1 className="u-mt-m">Reports</h1>
                                <div className="grid grid--column@xxs@s u-mt-m">
                                    <div className="grid__col col-6@m">
                                        <div className="card" aria-labelledby="interviewer-call-history"
                                             aria-describedby="interviewer-call-history-text">
                                            <h2 className="u-fs-m" id="interviewer-call-history">
                                                <Link to="/interviewer-call-history">
                                                    Interviewer call history
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
                                                    Interviewer call pattern
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
                            </main>
                        </Route>
                    </Switch>
                </DefaultErrorBoundary>
            </div>
            <Footer/>
        </>
    );
}

export default App;
