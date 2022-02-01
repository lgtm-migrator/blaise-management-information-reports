import React, { ReactElement, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { BetaBanner, DefaultErrorBoundary, Footer, Header } from "blaise-design-system-react-components";
import InterviewerCallHistory from "./reports/InterviewerCallHistory";
import InterviewerCallPattern from "./reports/InterviewerCallPattern";
import AppointmentResourcePlanning from "./reports/AppointmentResourcePlanning/AppointmentResourcePlanning";
import "./style.css";
import LoginForm from "./components/LoginForm";
import { useToken, clearToken } from "./client/token";
import { validateToken } from "./client/user";

const divStyle = {
    minHeight: "calc(72vh)"
};

function App(): ReactElement {
    const location = useLocation();
    const { token, setToken } = useToken();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        console.log(location);
        validateToken(token).then((validated: boolean) => {
            setLoggedIn(validated);
        }).catch((error: unknown) => {
            console.log(`Error checking logged in state: ${error}`);
            setLoggedIn(false);
        });
    });

    function loginPage(): ReactElement {
        if (loggedIn) {
            return <></>;
        }
        return <LoginForm setToken={setToken} />;
    }

    function signOut(): void {
        clearToken();
        setToken(null);
        setLoggedIn(false);
    }

    function app(): ReactElement | undefined {
        if (loggedIn) {
            return (<DefaultErrorBoundary>
                <Switch>
                    <Route path="/interviewer-call-history">
                        <InterviewerCallHistory />
                    </Route>
                    <Route path="/interviewer-call-pattern">
                        <InterviewerCallPattern />
                    </Route>
                    <Route path="/appointment-resource-planning">
                        <AppointmentResourcePlanning />
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
                                <div className="grid__col col-6@m">
                                    <div className="card" aria-labelledby="appointment-resource-planning"
                                        aria-describedby="appointment-resource-planning-text">
                                        <h2 className="u-fs-m" id="appointment-resource-planning">
                                            <Link to="/appointment-resource-planning">
                                                Appointment resource planning
                                            </Link>
                                        </h2>
                                        <p id="appointment-resource-planning-text">Generate report to view the
                                            number of interview appointments scheduled for a given date.</p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </Route>
                </Switch>
            </DefaultErrorBoundary>
            );
        }
        return undefined;
    }

    return (
        <>
            <a className="skip__link" href="#main-content">Skip to main content</a>
            <BetaBanner />
            <Header title={"Management Information Reports"} signOutButton={true} noSave={true} signOutFunction={signOut} />
            <div style={divStyle} className="page__container container">
                {loginPage()}
                {app()}
            </div>
            <Footer />
        </>
    );
}

export default App;
