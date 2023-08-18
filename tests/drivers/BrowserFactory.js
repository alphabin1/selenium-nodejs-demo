require('chromedriver');
require('dotenv').config();
const Browser = require('./../drivers/Browser');
const ConfigFactory = require('./../drivers/ConfigFactory');
const ProcessUtil = require('../utils/ProcessUtils');
const Chrome = require('selenium-webdriver/chrome');
const {Builder, Capabilities} = require('selenium-webdriver');
const Firefox = require('selenium-webdriver/firefox.js');
const edge = require('selenium-webdriver/edge');
const {Capability} = require('selenium-webdriver/lib/capabilities');

class BrowserFactory {
  /**
   * Creates a browser instance based on the browser type specified in the configuration.
   * The browser instance is created with the specified driver, either headless or not, and with BrowserStack enabled or not.
   * @param {Object} mochaContext - The Mocha context object.
   * @return {Browser} A new Browser instance.
   */
  static async createBrowser(mochaContext) {
    this.config = await ConfigFactory.getConfig();
    const driver = await this.createDriverFromBrowserType(this.config.browser, this.config.isHeadless, this.config.browserStackEnabled);
    return new Browser(mochaContext, driver);
  }

  /**
   * Creates a WebDriver instance based on the given browser type and configuration settings.
   *
   * @param {string} browserType - The type of browser to create the driver for (e.g. chrome, firefox, edge, safari).
   * @param {boolean} isHeadless - Whether the browser should run in headless mode.
   * @param {boolean} browserStackEnabled - Whether the tests should be run on BrowserStack.
   * @return {WebDriver} The created WebDriver instance.
   */
  static async createDriverFromBrowserType(browserType, isHeadless, browserStackEnabled) {
    console.info(`Creating the Driver from given browser: ${browserType} with Headless mode: ${isHeadless} ${(browserStackEnabled) ? 'on BrowserStack' : ''}`);
    if (browserStackEnabled) {
      return await this.createBrowserStackDriver(browserType);
    }
    let driver;
    switch (browserType) {
    case 'chrome':
      driver = await this.createChromeDriver(isHeadless);
      break;
    case 'firefox':
      driver = await this.createFirefoxDriver(isHeadless);
      break;
    case 'edge':
      driver = await this.createEdgeDriver(isHeadless);
      break;
    case 'safari':
      driver = await this.createSafariDriver();
      break;
    default:
      const message = 'User has not selected any browser to run automation tests upon!';
      console.log(message);
      await ProcessUtil.returnPromiseError(message);
      throw new Error(message);
    }
    return driver;
  }

  /**
  * Creates a Chrome driver with the given headless mode option and other arguments
  * @param {boolean} isHeadless - True if the driver should run in headless mode, false otherwise
  * @return {Promise} A Promise that resolves to a Chrome driver instance
  */
  static async createChromeDriver(isHeadless) {
    console.log('Creating chrome driver...');

    const options = new Chrome.Options();
    if (isHeadless) {
      options.headless();
      options.addArguments(
        '--incognito',
        '--disable-gpu',
        '--window-size=1920,1080'
      );
    }
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);
    const driver = await new Builder()
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .setChromeOptions(options)
      .build();
    await driver.manage().window().maximize();
    return driver;
  }

  /**
   * Creates a Firefox WebDriver instance with the specified options.
   * @param {boolean} isHeadless - Whether to start Firefox in headless mode or not.
   * @return {WebDriver} - A WebDriver instance for Firefox.
   */
  static async createFirefoxDriver(isHeadless) {
    console.info('Creating geckodriver...');
    const options = new Firefox.Options();
    if (isHeadless) {
      options.headless();
      options.addArguments(
        '--test-type',
        '--incognito',
        '--disable-gpu',
        '--window-size=1920,1080'
      );
    }

    const driver = new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    await driver.manage().window().maximize();
    return driver;
  }

  /**
   * Creates a new instance of EdgeDriver with specified options.
   *
   * @param {boolean} isHeadless - Flag indicating if the browser should be headless or not
   * @return {Promise<edge.Driver>} - Promise resolving to a new instance of EdgeDriver
   */
  static async createEdgeDriver(isHeadless) {
    console.log('Creating ms edge driver on local machine...');
    const options = new edge.Options().setEdgeChromium(true);
    if (isHeadless) {
      options.addArguments(
        '--test-type',
        '--incognito',
        '--headless',
        '--disable-gpu',
        '--window-size=1920,1080'
      );
    }
    const driver = edge.Driver.createSession(options);
    await driver.manage().window().maximize();
    return driver;
  }

  /**
   * Creates a new instance of the Safari browser driver and maximizes its window
   *
   * @return {Promise} Promise object that resolves to the Safari driver instance
   */
  static async createSafariDriver() {
    console.log('Creating safari driver...');
    const driver = await new Builder()
      .forBrowser('safari')
      .build();
    await driver.manage().window().maximize();
    return driver;
  }

  /**
   * Create a Selenium WebDriver instance for a given browser type using BrowserStack
   * @param {string} browserType - The type of browser to create a driver for (e.g. "chrome", "firefox")
   * @return {Promise} - A Promise that resolves to a WebDriver instance
   */
  static async createBrowserStackDriver(browserType) {
    console.log('Creating chrome driver on BrowserStack...');
    const USERNAME = process.env.BROWSERSTACK_USERNAME;
    const AUTOMATE_KEY = process.env.BROWSERSTACK_AUTOMATE_KEY;
    const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@hub-cloud.browserstack.com/wd/hub';
    const capabilities = {
      'browserName': browserType,
      'browserVersion': 'latest',
      'bstack:options': {
        os: this.config.browserStackOS,
        osVersion: this.config.browserStackOSVersion,
        projectName: 'test-automation',
        buildName: `Testing with ${browserType} on ${this.config.browserStackOS}`,
        networkLogs: true
      }
    };
    const driver = await new Builder().usingServer(browserstackURL).withCapabilities(capabilities).build();
    await driver.manage().window().maximize();
    return driver;
  }

  /**
   * Create a Selenium WebDriver instance for Google Chrome using SauceLabs
   * @return {Promise} - A Promise that resolves to a WebDriver instance
  */
  static async createSauceLabsChromeDriver() {
    console.log('Creating chrome driver on SauceLabs...');
    const USERNAME = 'pratik';
    const AUTOMATE_KEY = 'bd60aace-dbba-4b09-ac91-1b7ee61b09d1';
    const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@ondemand.us-west-1.saucelabs.com:443/wd/hub';

    const capabilities = {
      'browserName': 'chrome',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      'sauce:options': {}
    };
    const driver = await new Builder().usingServer(browserstackURL).withCapabilities(capabilities).build();
    await driver.manage().window().maximize();
    return driver;
  }
}

module.exports = BrowserFactory;
