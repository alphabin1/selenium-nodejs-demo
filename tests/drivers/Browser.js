require('dotenv').config();
const os = require('os');
const FileUtil = require('../utils/FileUtils');
const SelectorType = require('./SelectorType');
const ProcessUtil = require('../utils/ProcessUtils');
const ConfigFactory = require('./../drivers/ConfigFactory');
const {Key, By, until} = require('selenium-webdriver');

class Browser {
  static mainWindowHandler = '';

  constructor(mochaContext, driver) {
    this.testConfig = ConfigFactory.getConfig();
    this.mochaContext = mochaContext;
    this.driver = driver;
  }

  /**
 * Returns the payever Account URL for the current test configuration.
 * @return {string} The payever account URL.
 */
  getPayEverUrl() {
    return this.testConfig.payEverUrl;
  }

  /**
   * Navigates the browser to the specified URL and clears the main window handler.
   * @param {string} url - The URL to navigate to.
   */
  async navigate(url) {
    await this.driver.navigate().to(url);
    this.clearMainWindowHandler();
  }

  /**
   * Clear the main window handler.
   * Used after navigation to ensure the main window handler is reset.
   */
  clearMainWindowHandler() {
    this.mainWindowHandler = '';
  }

  /**
   * Closes the WebDriver instance and quits the driver.
   */
  async close() {
    await this.driver.quit();
  }

  /**
   * Finds a web element based on the selector type and locator.
   * @param {string} selectorType - The type of selector to use. Either 'css' or 'xpath'.
   * @param {string} locator - The selector to locate the element.
   * @param {number} [timeout] - Optional. The maximum time to wait for the element to appear in milliseconds.
   * @return {Promise} A Promise that resolves to the located web element.
   */
  async findBySelectorType(selectorType, locator, timeout) {
    return selectorType === SelectorType.CSS ?
      (timeout ? await this.findByCss(locator, timeout) : await this.findByCss(locator)) :
      (timeout ? await this.findByXpath(locator, timeout) : await this.findByXpath(locator));
  }

  /**
   * Finds the first or all elements matching a given CSS selector, using a specified timeout.
   * @param {string} cssPath - The CSS selector of the element(s) to find.
   * @param {number} [timeout=this.testConfig.defaultElementTimeout] - The maximum time (in milliseconds) to wait for the element(s) to be located. If not specified, the default timeout from the test configuration will be used.
   * @param {boolean} [multipleElements=false] - If `true`, returns an array with all matching elements. If `false` (default), returns only the first matching element.
   * @return {Promise<WebElement|Array<WebElement>>} - A promise that resolves to the found element(s) (or an array of elements).
   * @throws {Error} - If the element(s) cannot be located within the specified timeout.
   */
  async findByCss(cssPath, timeout, multipleElements = false) {
    const optTimeout = timeout || this.testConfig.defaultElementTimeout;
    const condition = until.elementLocated(By.css(cssPath));
    return new Promise((resolve, reject) => {
      this.driver.wait(condition.fn, optTimeout, `could not load the element with given css selector : ${cssPath}`)
        .then(() => {
          if (multipleElements) {
            return this.driver.findElements(By.css(cssPath));
          } else {
            return this.driver.findElement(By.css(cssPath));
          }
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Finds an element using an XPath selector.
   * @param {string} xPath - The XPath selector to use.
   * @param {number} [timeout] - Optional timeout in milliseconds.
   * @param {boolean} [multipleElements=false] - Set to true to return multiple elements, if found.
   * @return {Promise<WebElement|Array<WebElement>>} A promise that resolves to a single WebElement or an array of WebElements.
   */
  async findByXpath(xPath, timeout, multipleElements = false) {
    const optTimeout = timeout || this.testConfig.defaultElementTimeout;
    const condition = until.elementLocated(By.xpath(xPath));
    return new Promise((resolve, reject) => {
      this.driver.wait(condition.fn, optTimeout, `could not load the element with given xpath selector : ${xPath}`)
        .then(() => {
          if (multipleElements) {
            return this.driver.findElements(By.xpath(xPath));
          } else {
            return this.driver.findElement(By.xpath(xPath));
          }
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Finds all elements based on the selector type and locator.
   *
   * @param {string} selectorType - The selector type to be used. Must be a valid value from the SelectorType enum.
   * @param {string} locator - The locator value to be used for finding the elements.
   * @return {Promise<Array>} - A promise that resolves to an array of WebElements matching the selector and locator.
   */
  async findAllBySelectorType(selectorType, locator) {
    return selectorType = SelectorType.CSS ?
      await this.findByCss(locator, this.testConfig.defaultElementTimeout, true) :
      await this.findByXpath(locator, this.testConfig.defaultElementTimeout, true);
  }

  /**
   * Delays execution by the specified amount of time.
   * @param {number} timeInMillis - The amount of time to delay, in milliseconds.
   * @return {Promise<void>} - A promise that resolves after the specified delay.
   */
  async delay(timeInMillis) {
    return await new Promise((resolve) => setTimeout(resolve, timeInMillis));
  }

  /**
   * Checks if an element exists on the page with the given selector.
   * @param {string} selectorType - Type of selector (CSS or XPATH).
   * @param {string} locator - Selector value.
   * @return {Promise<boolean>} - A Promise that resolves to a boolean value indicating whether the element exists.
   */
  async elementExists(selectorType, locator) {
    if (selectorType = SelectorType.CSS) {
      return (await this.driver.findElements(By.css(locator))).length > 0;
    } else {
      return (await this.driver.findElements(By.xpath(locator))).length > 0;
    }
  }

  /**
   * Waits until the specified element is enabled or throws an error.
   *
   * @param {string} selectorType - The type of selector to use (e.g. 'id', 'name', 'class').
   * @param {string} locator - The value of the selector (e.g. 'my-button', '.my-class').
   * @throws {Error} - If the element is not enabled after the timeout period.
   */
  async waitUntilEnabledOrThrowError(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
  }


  /**
   * Scrolls an element matched by the given selector type and locator into view.
   * @param {string} selectorType - The type of selector to use to locate the element (e.g., "id").
   * @param {string} locator - The value of the selector to use to locate the element (e.g., "my-element").
   */
  async scrollIntoView(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    const javaScript = 'arguments[0].scrollIntoView(true)';
    await this.executeJavaScript(javaScript, element);
  }

  /**
   * Checks whether an element is visible on the page.
   * @param {Element} element - The element to check for visibility.
   * @return {boolean} `true` if the element is visible, `false` otherwise.
   */
  async isElementVisibleOnView(element) {
    return await this.executeJavaScript('return window.getComputedStyle(arguments[0]).visibility !== hidden', element);
  }

  /**
   * Clears the text in a text input using a keyboard shortcut.
   * @param {string} selectorType - The type of selector to use to find the element.
   * @param {string} locator - The locator value to use to find the element.
   */
  async clearTextWithKeyboardShortcut(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);

    const controlKey = os.platform() === 'darwin' ? Key.COMMAND : Key.CONTROL;
    await element.sendKeys(Key.chord(controlKey, 'a'), Key.BACK_SPACE);
    console.info('Cleared the input with keyboard shortcut.');
  }

  /**
   * Sends keys to an input field, optionally clearing the existing text first.
   * @param {string} selectorType - The type of selector to use to find the element.
   * @param {string} locator - The locator value to use to find the element.
   * @param {string} text - The text to type into the input field.
   * @param {boolean} [clear=true] - Whether to clear the existing text in the input field before
   * typing the new text. Defaults to true.
   * @return {WebElement} The element that received the keys.
   */
  async sendKeys(selectorType, locator, text, clear = true) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);

    if (clear) {
      await this.clearTextWithKeyboardShortcut(selectorType, locator);
    }

    await element.sendKeys(text);
    console.info('Sendkeys performed successfully. Typed text is: ' + await element.getAttribute('value'));
    return element;
  }

  /**
   * Sends the provided text to the specified element using JavaScript.
   *
   * @param {string} selectorType - The type of selector to use (e.g. "id", "name", "class", etc.).
   * @param {string} locator - The value of the selector to use.
   * @param {string} text - The text to send to the element.
   *
   * @return {Promise<WebElement>} A promise that resolves to the element the text was sent to.
   */
  async sendKeysJS(selectorType, locator, text) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled();
    await element.clear();
    if (text != null) {
      const javaScript = `arguments[0].setAttribute('value', ${text});`;
      await this.executeJavaScript(javaScript, element);
      console.info('sendKeyJS performed successfully. Typed text is: ' + await element.getAttribute('value'));
    }
    return element;
  }

  /**
   * Clicks the given element.
   *
   * @param {string} selectorType - The selector type used to locate the element.
   * @param {string} locator - The locator used to locate the element.
   * @return {Promise<void>} - A Promise that resolves when the click operation has completed.
   */
  async click(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
    await element.click();
  }

  /**
   * Clicks on an element using JavaScript.
   *
   * @param {string} selectorType - The type of selector to use (e.g. "id", "name", "class").
   * @param {string} locator - The locator of the element to click.
   * @return {Promise<void>}
   */
  async clickJS(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
    await this.executeJavaScript('arguments[0].click();', element);
  }

  /**
   * Waits until an element is both visible and enabled on the page.
   *
   * @param {WebElement} element - The element to wait for.
   * @return {Promise<void>} - A promise that resolves when the element is both visible and enabled.
   */
  async waitUntilElementEnabled(element) {
    await this.driver.wait(until.elementIsVisible(element), this.testConfig.defaultElementTimeout, 'Element is not visible!');
    await this.driver.wait(until.elementIsVisible(element), this.testConfig.defaultElementTimeout, 'Element is not enabled!');
  }

  /**
   * Captures a screenshot of the current page and saves it to the specified directory with the given name.
   *
   * @param {string} directory - The directory where the screenshot will be saved.
   * @param {string} imageName - The name of the screenshot file.
   */
  async captureScreenshot() {
    try {
      console.log('Capturing Screenshot');
      const screenshot = await this.driver.takeScreenshot();
      return `data:image/png;base64,${screenshot}`;
    } catch (error) {
      console.error('Error capturing screenshot: ', error);
    }
  }

  /**
   * Gets an array of window handles for all open browser windows.
   *
   * @return {Promise<string[]>} - A promise that resolves to an array of window handles.
   */
  async getAllWindowHandles() {
    return await this.driver.getAllWindowHandles();
  }

  /**
   * Gets the handle of the currently focused browser window.
   *
   * @return {Promise<string>} - A promise that resolves to the handle of the current window.
   */
  async getCurrentWindowHandle() {
    return await this.driver.getWindowHandle();
  }

  /**
   * Switches to the last (rightmost) browser tab.
   *
   * @return {Promise<void>}
   */
  async switchToLastBrowserTab() {
    const allWinHandles = await this.getAllWindowHandles();
    const lastBrowserTabIndex = allWinHandles.length - 1;
    await this.delay(1000);
    await this.switchToBrowserTab(lastBrowserTabIndex);
  }

  /**
   * Switches to a browser tab specified by the given index.
   *
   * @param {number} index - The index of the tab to switch to.
   * @return {Promise<number>} - The index of the tab that was switched to.
   */
  async switchToBrowserTab(index) {
    console.info(`[SwitchToBrowserTab: ${index}]`);
    const tabs = await this.driver.getAllWindowHandles();
    const handle = tabs[index];
    console.info(`[Handle: ${handle}]`);
    await this.driver.switchTo().window(handle);
    const currentUrl = await this.driver.getCurrentUrl();
    console.info(`[After switching the current URL is: ${currentUrl}]`);
    return index;
  }

  /**
   * Closes the current browser tab and switches to the previous one.
   * If there is no previout tab, the browser will be closed
   *
   * @return {Promise<void>}
   */
  async closeBrowserTab() {
    console.info('[Browser tab is being closed..]');
    const currentUrl = await this.driver.getCurrentUrl();
    console.info(`[Closing browser tab URL: ${currentUrl}]`);
    await this.driver.close();
    try {
      await this.driver.getCurrentUrl();
      await this.closeBrowserTab();
    } catch (e) {
      console.info('[Browser tab closed!]');
    }
  }

  /**
   * Executes the given JavaScript code with the provided arguments and returns the output.
   *
   * @param {string} javaScript - The JavaScript code to execute.
   * @param {Array} args - An array of arguments to pass to the JavaScript code.
   * @return {*} - The output of the JavaScript code execution.
   * @throws Error if there's any error while executing JavaScript.
   */
  async executeJavaScript(javaScript, args) {
    try {
      const jsOutput = await this.driver.executeScript(javaScript, args);
      return jsOutput;
    } catch (err) {
      console.error(`An error occurred while executing JavaScript: ${err.message}`);
      throw err;
    }
  }

  /**
   * Handles and processes an error.
   * @param {string} error
   */
  async issueError(error) {
    await ProcessUtil.errorToPromiseError(error);
  }

  /**
  * This function refreshes the current page by calling the navigate().refresh() method on the WebDriver instance.
  * It also logs a message to the console indicating that the page is being refreshed.
  */
  async refresh() {
    console.info('Refresh()');
    await this.driver.navigate().refresh();
  }

  // Dynamic waitForElement
  async dynamicWaitForElement(selectorType, locator, waitTimeForElement, intervalTime) {
    while (!(await this.isVisible(selectorType, locator))) {
      this.delay(intervalTime);
      waitTimeForElement -= intervalTime;
      if (waitTimeForElement < 1) break;
    }
  }

  async isVisible(selectorType, locator) {
    try {
      const el = await this.findBySelectorType(selectorType, locator);
      // await el.waitForDisplayed({ timeout: waitTimeInSeconds * 1000 });
      return !!(await el.isDisplayed());
    } catch (err) {
      console.error(err);
      throw new Error(`element is not visible: ${err}`);
    }
  }
}

module.exports = Browser;
