require('dotenv').config();
const BrowserFactory = require('../drivers/BrowserFactory');
const AllPages = require('../pages/AllPages');
const addContext = require('mochawesome/addContext');

describe('Demo Automation Testing', function() {
  let allPages;

  before('Open Browser', async function() {
      this.browser = await BrowserFactory.createBrowser(this);
      allPages = await new AllPages(this.browser);
  });

  describe('Verify user should able to register /fashion site and validate dashboard screen', function() {
    const unique = new Date().getTime()
    const value = 'fashion';
    const firstName = 'test'
    const lastName = 'pratik'
    const email = `${unique}@testpratik.com`
    const password = `12qw!@QW`
    const confirmPass = `12qw!@QW`
    const companyName = 'Testing Company'
    const industry = 'Fashion'
    const phoneNumber = '123123123'

    it('User should be able to register successfully', async function() {
      await allPages.registrationPage.goToRegistrationPage(value)
      await allPages.registrationPage.fillRegistrationForm(firstName, lastName, email, password, confirmPass)
    })

    it('User should be able to fill the business account form', async function() {
      await allPages.businessInfoPage.fillBusinessInfoFormForFashion(companyName, industry, phoneNumber)
    })

    it('User should be able to view the business apps for fashion', async function() {
      await allPages.dashboardPage.clickOnGetStartedButton()
      await allPages.dashboardPage.assertTransactionsAppIsVisible()
      await allPages.dashboardPage.assertCheckoutAppIsVisible()
      await allPages.dashboardPage.assertConnectAppIsVisible()
      await allPages.dashboardPage.assertProductsAppIsVisible()
      await allPages.dashboardPage.assertShopAppIsVisible()
      await allPages.dashboardPage.assertSettingAppIsVisible()
    })
  });

  describe('Verify user should able to register /santander site and validate dashboard screen', function() {
    const unique = new Date().getTime() + 1
    const value = 'santander';
    const firstName = 'test'
    const lastName = 'pratik'
    const email = `${unique}@testpratik.com`
    const password = `12qw!@QW`
    const confirmPass = `12qw!@QW`
    const companyName = 'Testing Company'
    const industry = 'Industrial Hardware'
    const phoneNumber = '123123123'
    const VATnumber = '123412341234'

    it('User should be able to register successfully', async function() {
      await allPages.registrationPage.goToRegistrationPage(value)
      await allPages.registrationPage.fillRegistrationForm(firstName, lastName, email, password, confirmPass)
    })

    it('User should be able to fill the business account form', async function() {
      await allPages.businessInfoPage.fillBusinessInfoFormForSantander(companyName, industry, phoneNumber, VATnumber)
    })

    it('User should be able to view the business apps for santander', async function() {
      await allPages.dashboardPage.clickOnGetStartedButton()
      await allPages.dashboardPage.assertTransactionsAppIsVisible()
      await allPages.dashboardPage.assertCheckoutAppIsVisible()
      await allPages.dashboardPage.assertConnectAppIsVisible()
      await allPages.dashboardPage.assertPointOfSaleAppIsVisible()
      await allPages.dashboardPage.assertSettingAppIsVisible()
    })
  });

  afterEach(async function() {
    if (this.currentTest.state == 'failed') {
      const screenshot = await this.browser.captureScreenshot();
      addContext(this, {
        title: this.currentTest.title,
        value: screenshot,
        type: 'image/png'
      });
    }
  });

  after(async function() {
    if (this.test.state != 'passed') {
      const screenshot = await this.browser.captureScreenshot();
      addContext(this, {
        title: 'Screenshot',
        value: screenshot,
        type: 'image/png'
      });
    }
    await this.browser.close();
  });
});
