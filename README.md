# Blaise Management Information Reports ![Ernie](.github/ernie.png)

[![codecov](https://codecov.io/gh/ONSdigital/blaise-management-information-reports/branch/main/graph/badge.svg)](https://codecov.io/gh/ONSdigital/blaise-management-information-reports)
<img src="https://github.com/ONSdigital/blaise-management-information-reports/workflows/Test%20coverage%20report/badge.svg">
<img src="https://img.shields.io/github/release/ONSdigital/blaise-management-information-reports.svg?style=flat-square">
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/pulls)
[![Github last commit](https://img.shields.io/github/last-commit/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/commits)
[![Github contributors](https://img.shields.io/github/contributors/ONSdigital/blaise-management-information-reports.svg)](https://github.com/ONSdigital/blaise-management-information-reports/graphs/contributors)

Web-based user interface for running and viewing management information reports.

![UI](.github/ui.png)

This project is a React.js application which when built is rendered by a Node.js express server.

The application is being deployed to Google App Engine.

The application calls API endpoints from the BERT application to receive the management information data.

![Flow](.github/bert-ernie-flow.png)

### Local Setup

Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) if you haven't already done so.

Clone the repository:

```shell script
git clone https://github.com/ONSdigital/blaise-management-information-reports.git
```

Create an .env file in the root of the project and add the following variables:

| Variable | Description | Example |
| --- | --- | --- |
| PROJECT_ID | | blah |
| BERT_URL | The base URL the application will use to formulate URLs for API calls. | https://dev-bert.social-surveys.gcp.onsdigital.uk |
| BERT_CLIENT_ID | | blah |


Install the project dependencies:

```shell script
yarn install
```

Run Node.js via the package.json script:

```shell script
yarn start-server
```

Run React.js via the package.json script:

```shell script
yarn start-react
```

The UI should now be accessible via:

http://localhost:3000/

Tests can be run via the package.json script:

```shell script
yarn test
```

Test snapshots can be updated via:

```shell script
yarn test -u
```
