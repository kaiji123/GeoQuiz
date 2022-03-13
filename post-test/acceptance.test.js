require('chromedriver');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();


describe('quiz-generator.pickRandom', () => {
  it('api/top5 get test', async()=> {
    
  
      try {
        await driver.get('http://www.google.com/ncr');
      } finally {
        await driver.quit();
      }
    
  });
});
