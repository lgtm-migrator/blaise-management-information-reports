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

                                <ErrorBoundary errorMessageText={""}>
                                    <Link to="/interviewer-call-history" id="interviewer-call-history">
                                        Interviewer Call History
                                    </Link>
                                </ErrorBoundary>
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
