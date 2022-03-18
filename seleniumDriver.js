const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');



      
function example() {
    
    let driver =  new Builder().forBrowser("chrome")
    .withCapabilities(Capabilities.chrome())
    .usingServer('http://68.183.42.162:4444/wd/hub')
    .build();

       try {
           
        driver.get('http://www.linode.com/docs');
        driver.findElement(By.name('q')).sendKeys('nginx', Key.RETURN);
        let el = driver.findElement(By.linkText('How to Configure nginx'));
        
      } finally {
         driver.quit();
      }
};

 function main() {
    example();
}

main();