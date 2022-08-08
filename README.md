# Blaise Management Information Reports ![Ernie](.github/ernie.png)

[![codecov](https://codecov.io/gh/ONSdigital/blaise-management-information-reports/branch/main/graph/badge.svg)](https://codecov.io/gh/ONSdigital/blaise-management-information-reports)
<img src="https://github.com/ONSdigital/blaise-management-information-reports/workflows/Test%20coverage%20report/badge.svg">
<img src="https://img.shields.io/github/release/ONSdigital/blaise-management-information-reports.svg?style=flat-square">
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/pulls)
[![Github last commit](https://img.shields.io/github/last-commit/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/commits)
[![Github contributors](https://img.shields.io/github/contributors/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/graphs/contributors)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/ONSdigital/blaise-management-information-reports.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ONSdigital/blaise-management-information-reports/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ONSdigital/blaise-management-information-reports.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ONSdigital/blaise-management-information-reports/context:javascript)

Web-based user interface for running and viewing management information reports.

![UI](.github/ui.png)

This project is a React.js application which when built is rendered by a Node.js express server.

The application is being deployed to Google App Engine.

The application calls API endpoints from the BERT application to receive the management information data.

![Flow](.github/bert-ernie-flow.png)

### Setup

#### Prerequisites

To run Blaise Management Information Reports locally, you'll need to have [Node installed](https://nodejs.org/en/), as
well as [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable).

Clone the repository:

```shell script
git clone https://github.com/ONSdigital/blaise-management-information-reports.git
```

Create an .env file in the root of the project and add the following variables:

| Variable | Description | Example |
| --- | --- | --- |
| PROJECT_ID | To <i>run</i> locally, set this to the unique GCP project ID. Set to anything when <i>testing</i> locally. | blah |
| BERT_URL | The base URL the application will use to formulate URLs for API calls. Consider giving "IAP-secured Web App User" permission to "allUsers" in a sandbox when testing locally. | https://dev-bert.social-surveys.gcp.onsdigital.uk |
| BERT_CLIENT_ID | For authenticating with BERT in locked down formal environments. Set to anything when testing locally. | blah |
| BLAISE_API_URL | For authenticating with Blaise. | http://localhost:8011 |

To find the `X_CLIENT_ID`, navigate to the GCP console, search for `IAP`, click the three dots on right of the service and select `OAuth`. `Client Id` will be on the right.

The .env file should be setup as below

```.env
PROJECT_ID=ons-blaise-v2-dev-<sandbox>
BERT_URL=https://dev-<sandbox>-bert.social-surveys.gcp.onsdigital.uk
BERT_CLIENT_ID=foo.apps.googleusercontent.com
BLAISE_API_URL=http://localhost:8011
```

Run the following command to export your environment variables:

```shell script
export $(cat .env | xargs)
```

Install the project dependencies:

```shell script
yarn install
```

To authenticate MIR login, you'll need to
have [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) running locally (On a Windows machine), or you
can [create an Identity-Aware Proxy (IAP) tunnel](https://cloud.google.com/sdk/gcloud/reference/compute/start-iap-tunnel)
from a GCP Compute Instance running the rest API in a sandbox.

First, authenticate with Google:
```shell
gcloud auth login
```

Select the environment to connect to the rest-api, for example where PROJECT-ID is ons-blaise-v2-dev-<SANDBOX-NAME>:
```shell script
gcloud config set project <PROJECT-ID>
```

Run the following to connect to the rest api in your environment where <PORT> is the same port in your environment variables for BLAISE_API_URL:
```shell
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:<PORT> --zone europe-west2-a
```
NB Port 5004 is already in use by the server.

##### Run commands

In a new terminal run Node.js and React.js via the package.json script:

```shell script
yarn dev
```

The UI should now be accessible via:

http://localhost:3000/

Tests can be run via the package.json script:

```shell script
yarn test
```

To prevent tests from printing messages through the console tests can be run silently via the package.json script:

```shell script
yarn test --silent
```

Test snapshots can be updated via:

```shell script
yarn test -u
```

### Playwright tests 

To set up Playwright tests <i>locally</i> your .env file will need the following variables:

| Variable | Description | Example |
| --- | --- | --- |
| CATI_URL | The URL to CATI | https://dev-cati.social-surveys.gcp.onsdigital.uk |
| CATI_USERNAME | The username to log in to CATI | foobar |
| CATI_PASSWORD | The password to log in to CATi | foobar |
| REPORTS_URL | The URL to ERNIE | https://dev-reports.social-surveys.gcp.onsdigital.uk |
| REST_API_URL | The URL to swagger | http://localhost:8000 |
| TEST_QUESTIONNAIRE | The name of the test questionnaire in the DQS bucket (this questionnaire needs to be configured for appointments) | DST2111Z |
| SERVER_PARK | The name of the server park | gusty |

You <i>may</i> also need to run the following command to export the environment variables:

```shell script
export $(cat .env | xargs)
```

Select the environment to connect to the rest-api, for example where PROJECT-ID is ons-blaise-v2-dev-<your-sandbox> :
```shell script
gcloud config set project <PROJECT-ID>
```

Open the tunnel the to rest api:
```shell script
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:8000
```

(In a different terminal) Playwright tests can be run via:

```shell script
yarn run playwright test tests
```

Or a live demo can be run via:

```shell script
yarn run playwright test tests --headed
```

#### To help debug:
```shell script
export TRACE=true
yarn run playwright test tests
```
and once the tests have finished run the following, where <TEST-NAME> is the title of test.describe() and the test. For example, 'Without-data-I-can-get-to-and-run-an-ARPR-for-a-day-with-no-data':
```shell script
yarn run playwright show-trace test-results/tests-integration-arpr-<TEST-NAME>-chromium/trace.zip
```
