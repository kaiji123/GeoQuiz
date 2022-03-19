module.exports = Object.assign(
    {
      before: (browser, done) => {
        // runs before all of the tests run, call done() when you're finished
        done();
      },
      after: (browser, done) => {
        browser.end(); // kill the browser
        done(); // tell nightwatch we're done
      }
    },
    require("./example-flow.js")
  );
  