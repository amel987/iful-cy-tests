# Schneider Test Task

This project contains an automated test suite for Schneider Electric, built using Cypress for end-to-end testing.

## Project Description

The **Schneider Test Task** is a test automation suite designed to validate the functionality of a web application. It leverages Cypress for end-to-end testing and includes tools for generating detailed test reports.

## Installation
## Use

* Follow these steps to set up the project:
Install all dependencies with `npm install`
Ensure that Java is installed and accessible from the command line for running the server.

* Usage
The test suite includes commands to start the server and run Cypress tests.

* Starting the Server
To start the local server: `npm run start:server`
To open the interactive Cypress Test Runner: `npm run cy:open`
To execute tests in headless mode: `npm run cy:run`

* Reporting
The project uses cypress-mochawesome-reporter to generate detailed test execution reports. After running tests, the reports can be found in the cypress/reports directory.