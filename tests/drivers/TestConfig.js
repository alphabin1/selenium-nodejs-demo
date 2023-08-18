/**
 * TestConfig class defines a configuration object that holds various test configurations,
 * such as execution mode, browser, environment, default timeouts, and payever url.
 */
class TestConfig {
  // constructor
  constructor() {
    this.executionMode = 'local',
    this.browser = 'chrome',
    this.isHeadless = '';
    this.env = '',
    this.defaultElementTimeout = 30000,
    this.defaultPageLoadTimeout = 60000,
    this.defaultTestTimeout = 300000,
    this.payEverUrl = 'https://commerceos.staging.devpayever.com/login/';
  }

  // properties
  executionMode;
  browser;
  isHeadless;
  env;
  defaultElementTimeout;
  defaultPageLoadTimeout;
  defaultTestTimeout;
  payEverUrl;
}

module.exports = TestConfig;
