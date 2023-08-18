const BasePage = require('./BasePage');
const SelectorType = require('../drivers/SelectorType');
const TextInput = require('../pages/components/TextInput');
const Button = require('../pages/components/Button');

class RegistrationPage extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = this.browser.getPayEverUrl();
  }

  async goToRegistrationPage(value) {
    await super.goTo(`https://commerceos.staging.devpayever.com/registration/${value}`)
    await this.browser.delay(2000)
    await this.browser.refresh()
  }

  async inputFirstName(firstName) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=" First name "]').click()
    await new TextInput(this.browser, SelectorType.CSS, '[formcontrolname="firstName"]').fastType(firstName)
  }

  async inputLastName(lastName) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()= " Last name "]').click()
    await new TextInput(this.browser, SelectorType.CSS, '[formcontrolname="lastName"]').fastType(lastName)
  }

  async inputEmail(email) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()= " Email "]').click()
    await new TextInput(this.browser, SelectorType.CSS, '[formcontrolname="email"]').fastType(email)
  }

  async inputPassword(password) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=  " Password "]').click()
    await new TextInput(this.browser, SelectorType.CSS, '[formcontrolname="password"]').fastType(password)
  }

  async inputConfirmPassword(confirmPass) {
    await new Button(this.browser, SelectorType.XPATH, '//span[text()=  " Confirm Password "]').click()
    await new TextInput(this.browser, SelectorType.CSS, '[formcontrolname="confirmPass"]').fastType(confirmPass)
  }

  getSignUpForFreeButton() {
    return new Button(this.browser, SelectorType.CSS, '[class="signup-button"]')
  }

  async fillRegistrationForm(firstName, lastName, email, password, confirmPass) {
    await this.inputFirstName(firstName)
    await this.inputLastName(lastName)
    await this.inputEmail(email)
    await this.inputPassword(password)
    await this.inputConfirmPassword(confirmPass)
    await this.getSignUpForFreeButton().click()
  }
}

module.exports = RegistrationPage;
