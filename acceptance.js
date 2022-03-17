const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;
require("chromedriver")
var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();


async function testBrowser(){
try {
  await driver.get('http://www.google.com/ncr');
} 
catch(error){
  throw error;
}
finally {
  await driver.quit();
}
}

try{
testBrowser()
}catch(error){
  console.log(error)
}