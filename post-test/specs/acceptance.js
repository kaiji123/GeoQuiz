const webdriverio = require('webdriverio');
const chromedriver = require('chromedriver');

const port = 9515;
const args = [
  '--url-base=wd/hub',
  `--port=${port}`
];
chromedriver.start(args);

const options = {
  port,
  desiredCapabilities: {
    browserName: 'chrome'
  }
};
webdriverio
  .remote(options)
  .init()
  .on('error', (e) => console.error(e))
  .once('end', () => {
    console.log('end');
    chromedriver.stop();
  })
  .url('http://www.google.com')
  .getTitle().then(function (title) {
    console.log('Title was: ' + title);
  })
  .end();
