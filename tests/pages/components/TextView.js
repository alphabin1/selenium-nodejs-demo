const WebComponent = require('./WebComponent');

class TextView extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  /**
   * Retrieve the text value of an element.
   * @return {Promise<string>} The text value of the element.
   */
  async getText() {
    try {
      return await this.browser.getText(this.selectorType, this.locator);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }
}

module.exports = TextView;
