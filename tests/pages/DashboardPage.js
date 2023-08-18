const BasePage = require('./BasePage');
const SelectorType = require('../drivers/SelectorType');
const TextInput = require('../pages/components/TextInput');
const Button = require('../pages/components/Button');
const TextView = require('../pages/components/TextView');
const { expect } = require('chai');

class DashboardPage extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = this.browser.getPayEverUrl();
  }

  async clickOnGetStartedButton() {
    await this.browser.dynamicWaitForElement(SelectorType.CSS, '[class="welcome-screen-content-button"]', 30000, 0.3 )
    await new Button(this.browser, SelectorType.CSS, '[class="welcome-screen-content-button"]').click()
  }

  async assertTransactionsAppIsVisible() {
    const transaction = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Transactions"]').isDisplayedWithinTimeout()
    expect(transaction).to.be.true
  }

  async assertCheckoutAppIsVisible() {
    const checkout = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Checkout"]').isDisplayedWithinTimeout(10)
    expect(checkout).to.be.true
  }

  async assertConnectAppIsVisible() {
    const connect = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Connect"]').isDisplayedWithinTimeout(10)
    expect(connect).to.be.true
  }

  async assertProductsAppIsVisible() {
    const products = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Products"]').isDisplayedWithinTimeout(10)
    expect(products).to.be.true
  }

  async assertShopAppIsVisible() {
    const shop = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Shop"]').isDisplayedWithinTimeout(10)
    expect(shop).to.be.true
  }

  async assertSettingAppIsVisible() {
    const setting = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Settings"]').isDisplayedWithinTimeout(10)
    expect(setting).to.be.true
  }

  async assertPointOfSaleAppIsVisible() {
    const pointOfSale = await new TextView(this.browser, SelectorType.XPATH, '//div[text()="Point of Sale"]').isDisplayedWithinTimeout(10)
    expect(pointOfSale).to.be.true
  }
}

module.exports = DashboardPage;
