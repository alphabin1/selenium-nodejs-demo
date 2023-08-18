class BasePage {
  constructor(browser) {
    if (this.constructor == BasePage) {
      throw new Error('Abstract class can not be instantiated!');
    }
    this.url = '';
    this.browser = browser;
  }

  /**
   * Returns the name of the page class.
   * @return {string} The name of the page class.
   */
  getPageName() {
    return this.constructor.name;
  }

  /**
   * Navigates to the specified URL, or to the URL specified in the page's 'url' property if no URL is specified.
   * @param {string} url - The URL to navigate to. If not specified, the URL specified in the page's 'url' property will be used.
   * @throws {Error} Throws an error if the navigation fails.
   */
  async goTo(url = null) {
    if (!url) {
      url = this.url;
    }
    return this.browser.navigate(url).catch((error) => {
      throw new Error(`Page: '${this.getPageName()}' tried to go url: ${this.url}`);
    });
  }
}

module.exports = BasePage;
