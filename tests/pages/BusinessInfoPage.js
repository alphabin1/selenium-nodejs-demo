const BasePage = require('./BasePage');
const SelectorType = require('../drivers/SelectorType');
const TextInput = require('../pages/components/TextInput');
const Button = require('../pages/components/Button');
const { buildPath } = require('selenium-webdriver/http');

class BusinessInfoPage extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = this.browser.getPayEverUrl();
  }

  async inputCompanyName(companyName) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()= " Company name "]').click()
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Company name "]//parent::div//input').fastType(companyName)
  }

  async typeIndustry(industry) {
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Industry "]//parent::div//input').clearText()
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Industry "]//parent::div//input').fastType(industry)
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=" Company name "]//parent::div//input').click()
  }

  async typeIndustryForSantander(industry) {
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Industry "]').click()
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Industry "]//parent::div//input').fastType(industry)
    await new Button(this.browser, SelectorType.CSS, '[class="autocomplete-option-item__label"]').click()
  }

  async typePhoneNumber(phoneNumber) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=" Phone Number "]').click()
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" Phone Number "]//parent::div//input').fastType(phoneNumber)
  }

  async typeNumberForVAT(VATnumber) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=" VAT number "]').click()
    await new TextInput(this.browser, SelectorType.XPATH, '//span[text()=" VAT number "]//parent::div//input').fastType(VATnumber)
  }

  async clickOnGetStartedWithPayeverButton() {
    await new Button(this.browser, SelectorType.CSS, '[class="signup-button"]').click()
  }

  async fillBusinessInfoFormForFashion(companyName, industry, phoneNumber) {
    await this.inputCompanyName(companyName)
    await this.typeIndustry(industry)
    await this.typePhoneNumber(phoneNumber)
    await this.browser.delay(2000)
    await this.clickOnGetStartedWithPayeverButton()
  }

  async fillBusinessInfoFormForSantander(companyName, industry, phoneNumber, VATnumber) {
    await this.inputCompanyName(companyName)
    await this.typeIndustryForSantander(industry)
    await this.typePhoneNumber(phoneNumber)
    await this.typeNumberForVAT(VATnumber)
    await this.browser.delay(2000)
    await this.clickOnGetStartedWithPayeverButton()
  }
}

module.exports = BusinessInfoPage;
