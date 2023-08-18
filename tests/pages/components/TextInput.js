const {Key} = require('selenium-webdriver');
const WebComponent = require('./WebComponent');
const os = require('os');

class TextInput extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  /**
   * This method types the provided text into an input field, without pauses.
   * @param {string} text - The text to be typed.
   * @return {Promise<void>} - A Promise that resolves after the text has been typed.
   */
  async fastType(text) {
    try {
      await this.browser.sendKeys(this.selectorType, this.locator, text);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }
  
  /**
  * Clears the text from an input field using a keyboard shortcut.
  * @return {Promise<void>} Promise that resolves when text is cleared successfully or rejects with an error.
  */
  async clearText() {
    await this.browser.clearTextWithKeyboardShortcut(this.selectorType, this.locator);
  }
}

module.exports = TextInput;
