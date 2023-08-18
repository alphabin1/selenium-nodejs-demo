const WebComponent = require('./WebComponent');

class Button extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  /**
   * Clicks the element using the locator and selector type defined in the object.
   */
  async click() {
    await this.browser.click(this.selectorType, this.locator);
    await this.browser.delay(1000);
  }

  /**
   * Clicks on an element using JavaScript click method.
   */
  async clickJS() {
    await this.browser.clickJS(this.selectorType, this.locator);
    await this.browser.delay(1000);
  }
}

module.exports = Button;
