//./tests/pages/login.js


var loginCommands = {
  user1: function () {
    return this.login(
      process.env.USER1_LOGIN,
      process.env.USER1_PASSWORD,
      process.env.USER1_NAME,
    );
  },
  login (userName, password, userFullName) {
    this.waitForElementVisible("body")
      .setValue("@userName", userName)
      .setValue("@password", password)
      .saveScreenshot("tests_output/login-before-submit.png")
      .click("@submit")
      .assert.containsText("@fullName", userFullName)
      .saveScreenshot("tests_output/login-after-submit.png")
  }
};
module.exports = {
  commands: [loginCommands],
  url: function () {
    return process.env.URL;
  },
  elements: {
    userName: {
      selector: '[id="username"]'
      // locateStrategy: "css selector" //default
    },
    password: {
      selector: '[id="password"]'
    },
    submit: {
      selector: '[jhitranslate="login.form.button"]'
    },
    fullName: {
      selector: `//*[@jhitranslate="home.greet"]/span[contains(text(), "${process.env.USER1_NAME}")]`,
      locateStrategy: "xpath"
    },
  }
};