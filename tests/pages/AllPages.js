const RegistrationPage = require('./RegistrationPage')
const BusinessInfoPage = require('./BusinessInfoPage')
const DashboardPage = require('./DashboardPage')

class AllPages {
  constructor(browser) {
    this.registrationPage = new RegistrationPage(browser)
    this.businessInfoPage = new BusinessInfoPage(browser)
    this.dashboardPage = new DashboardPage(browser)
  }
}

module.exports = AllPages;
