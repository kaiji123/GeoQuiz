const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');

let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .usingServer('http://68.183.42.162:4444')
    .build();