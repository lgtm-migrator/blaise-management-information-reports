import React, {ReactElement} from "react";
import {DefaultErrorBoundary} from "./Components/ErrorHandling/DefaultErrorBoundary";
import {Route, Switch, Link} from "react-router-dom";
import {ErrorBoundary} from "./Components/ErrorHandling/ErrorBoundary";
import {BetaBanner, Footer, Header, ONSPanel} from "blaise-design-system-react-components";
import InterviewerCallHistory from "./reports/InterviewerCallHistory";

const divStyle = {
    minHeight: "calc(67vh)"
};

function App(): ReactElement {
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
                            <Route path="/">
                                {
                                    status !== "" &&
                                    <ONSPanel status={status?.includes("success") ? "success" : "error"}>
                                        <p>{status}</p>
                                    </ONSPanel>
                                }
                                <ONSPanel>
                                    <p>
                                        Data in these reports could be up to 24 hours out of date.
                                        <br />
                                        <br />
                                        These reports only go back to the last 12 months.
                                    </p>
                                </ONSPanel>
                                <br />

                                <div className="container">
                                    <div className="grid grid--column@xxs@s">
                                        <div className="grid__col col-6@m">
                                            <div className="card" aria-labelledBy="interviewer-call-history" aria-describedBy="interviewer-call-history-text">
                                                <h2 className="u-fs-m" id="interviewer-call-history">
                                                    <Link to="/interviewer-call-history" >
                                                        Interviewer Call History
                                                    </Link>
                                                </h2>
                                                <p id="interviewer-call-history-text">Generate report TR15 - Interviewer Call History.
                                                    Compliments TR9B for the assessing training needs.</p>
                                            </div>
                                        </div>
                                        {/* TODO: Removed as the report does not exist yet, to add back in */}
                                        {/*<div className="grid__col col-6@m">*/}
                                        {/*    <div className="card" aria-labelledBy="interviewer-pattern" aria-describedBy="interviewer-pattern-text">*/}
                                        {/*        <h2 className="u-fs-m" id="interviewer-pattern">*/}
                                        {/*            <Link to="/interviewer-pattern" >*/}
                                        {/*                Interviewer Pattern*/}
                                        {/*            </Link>*/}
                                        {/*        </h2>*/}
                                        {/*        <p id="interviewer-pattern-text">Generate TR9B - Interviewer Pattern.*/}
                                        {/*            Analyse productivity of interviewers to support identification of training needs.</p>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
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
