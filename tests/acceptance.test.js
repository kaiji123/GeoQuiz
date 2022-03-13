
var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();


describe('GET /api/top5', () => {
    it('api/top5 get test', async()=> {
     
    
        try {
          await driver.get('http://www.google.com/ncr');
        } finally {
          await driver.quit();
        }
      
    });
});