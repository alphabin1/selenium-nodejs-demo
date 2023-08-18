# Automation Task: Demo Website Tesitng
This is automation testing for the Demo website (`https://commerceos.staging.devpayever.com/registration`) using Selenium webdriver with mocha framework in javascript.

## Installation
To run the tests, ensure that Node.js is installed on your machine. Then, follow these steps:
    1. Navigate to the `demo-automation` directory.
    2. Install all the required dependencies and devDependencies in the `package.json` file by running the following command.
```sh
npm i
```

## Configuration
To configure the test execution, modify the `testconfig.json` file:
To run test cases in headless mode, set the value of `isHeadless` to true.

## Execution
Execute the test cases by running the following command:
```
npm run demo
```