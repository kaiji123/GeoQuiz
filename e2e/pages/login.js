//./tests/pages/login.js


var loginCommands = {
    user1: function () {
      return this.login(
        "process.env.USER1_LOGIN,",
        "process.env.USER1_PASSWORD",
        "process.env.USER1_NAME",
      );
    },
    login (userName, password, userFullName) {
      this.waitForElementVisible("body")
        .setValue("@userName", userName)
        .setValue("@password", password)
        .saveScreenshot("tests_output/login-before-submit.png")
        .click("@submit")
        .saveScreenshot("tests_output/login-after-submit.png")
      //  .assert.containsText("@fullName", userFullName)
      
    }
  };
  module.exports = {
    commands: [loginCommands],
    url: function () {
      return "https://www.cityx.ee/portal/#/login";
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