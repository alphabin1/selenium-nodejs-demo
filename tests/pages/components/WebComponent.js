const SelectorType = require('../../drivers/SelectorType');
const {By} = require('selenium-webdriver');

class WebComponent {
  constructor(browser, selectorType, locator) {
    this.browser = browser;
    this.selectorType = selectorType;
    this.locator = locator;
  }

  /**
   * Clicks on the element specified by this.locator.
   * If the element is not visible or the click operation fails for some other reason,
   * it logs an error and falls back to a JavaScript click.
   */
  async click() {
    try {
      await this.browser.scrollIntoView(this.selectorType, this.locator);
      await this.browser.click(this.selectorType, this.locator);
    } catch (error) {
      console.error(error);
      await this.browser.clickJS(this.selectorType, this.locator);
    }
  }


  /**
   * Finds the element specified by this.locator and returns it.
   * If the element cannot be found, it logs an error and throws an error.
   * @return {ElementHandle} - The element handle
   */
  async findElementOrThrowError() {
    let element;
    try {
      element = await this.browser.findBySelectorType(this.selectorType, this.locator, 3000);
      return element;
    } catch (error) {
      await this.browser.issueError(error);
      throw error;
    }
  }

  /**
   * Checks if the element specified by this.selectorType and this.locator is displayed on the page within the specified timeout.
   * @param {number} withinSeconds - The timeout in seconds
   * @return {boolean} - True if the element is displayed within the timeout, false otherwise.
   */
  async isDisplayedWithinTimeout(withinSeconds) {
    try {
      const el = await this.findElementOrThrowError(withinSeconds);
      const isElementDisplayed = await el.isDisplayed();
      return isElementDisplayed;
    } catch (e) {
      console.log(`Element '${this.selectorType}': '${this.locator}' is not found within: ${withinSeconds}. Timeout error occurred! \n${e} `);
      return false;
    }
  }

  /**
   * Checks if the element specified by this.selectorType and this.locator is enabled on the page within the specified timeout.
   * @param {number} withinSeconds - The timeout in seconds
   * @return {boolean} - True if the element is enabled within the timeout, false otherwise.
   */
  async isEnabled(withinSeconds) {
    try {
      const el = await this.findElementOrThrowError(withinSeconds);
      const isElementEnabled = await el.isEnabled();
      console.info(`Element '${this.selectorType}': '${this.locator}' is '${isElementEnabled}'!`);
      return isElementEnabled;
    } catch (e) {
      console.log(`Element '${this.selectorType}': '${this.locator}' is not found within: ${withinSeconds}. Timeout error occurred! \n${e} `);
      return false;
    }
  }

  /**
   * Checks if the element is available within the DOM
   * @return {boolean} true if the element is available, false otherwise
   */
  async isAvailable() {
    try {
      await this.findElementOrThrowError();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Waits until the element is enabled or throws an error.
   * @return {Promise<void>} A Promise that resolves when the element is enabled, or rejects with an error if it times out.
   */
  async waitUntilEnabledOrThrowError() {
    try {
      await this.browser.waitUntilEnabledOrThrowError(this.selectorType, this.locator);
      console.info(`Element '${this.selectorType}': '${this.locator}' is enabled.`);
    } catch (error) {
      await this.browser.issueError(error, `Failed to wait for element '${this.selectorType}': '${this.locator}' to be enabled.`);
    }
  }

  /**
  * This method gets the value of the specified attribute of the element.
  * @param {string} attributeName - The name of the attribute whose value to get.
  * @return {Promise<string>} - A promise that resolves to the value of the specified attribute of the element.
  */
  async getAttribute(attributeName) {
    const element = await this.findElementOrThrowError();
    return await element.getAttribute(attributeName);
  }
}

module.exports = WebComponent;
