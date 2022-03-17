const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
require("chromedriver")
var webdriver = require('selenium-webdriver');

async function testBrowser(){
  try{
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome())
    await driver.get("http://www.google.com")
  }
  catch(err){
    throw err
  }finally{
    await driver.quit()

  }



}
