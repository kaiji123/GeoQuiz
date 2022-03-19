exports.config = {

    // =====================
    // Server Configurations
    // =====================
    // Host address of the running Selenium server. This information is usually obsolete as
    // WebdriverIO automatically connects to localhost. Also if you are using one of the
    // supported cloud services like Sauce Labs, Browserstack or Testing Bot you also don't
    // need to define host and port information because WebdriverIO can figure that out
    // according to your user and key information. However if you are using a private Selenium
    // backend you should define the host address, port, and path here.
    //
    host: 'http://68.183.42.162/',
    port: 4444,
    path: '/wd/hub',
    //
    // =================
    // Service Providers
    // =================
    // WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
    // should work too though). These services define specific user and key (or access key)
    // values you need to put in here in order to connect to these services.
    //

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        '__e2e__/**.spec.js'
    ],
    // Patterns to exclude.
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude option in
    // order to group specific specs to a specific capability.
    //
    //
    // First you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox and Safari) and you have
    // set maxInstances to 1, wdio will spawn 3 processes. Therefor if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property basically handles how many capabilities
    // from the same test should run tests.
    //
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{
        browserName: 'chrome',
        chromeOptions: {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
            args: ['--headless', '--disable-gpu'],       
        }        
    }, 
    ],
    //
    // When enabled opens a debug port for node-inspector and pauses execution
    // on `debugger` statements. The node-inspector can be attached with:
    // `node-inspector --debug-port 5859 --no-preload`
    // When debugging it is also recommended to change the timeout interval of
    // test runner (eg. jasmineNodeOpts.defaultTimeoutInterval) to a very high
    // value and setting maxInstances to 1.
    debug: false,
    //
    // Additional list node arguments to use when starting child processes
    execArgv: [],
    //
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Per default WebdriverIO commands getting executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // using promises you can set the sync command to false.
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result | error
    
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Warns when a deprecated command is used
    deprecationWarnings: true,
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Saves a screenshot to a given path if a command fails.

    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts 
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl. 
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url 
    // gets prepended directly.
    baseUrl: 'www.geo-quiz.xyz/',
    //
    // Default timeout for all waitForXXX commands.
    waitforTimeout: 1000,
    //
    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as property. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    
    // Framework you want to run your specs with.
    // The following are supported: mocha, jasmine and cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed before running any tests.
    framework: 'mocha',
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide.html and click on "Reporters" in left column
    reporters: ['dot', 'json'],
    //
    // Some reporter require additional information which should get defined here
    reporterOptions: {
        //
        // If you are using the "xunit" reporter you should define the directory where
        // WebdriverIO should save all unit reports.
        outputDir: './__e2e/errorShots'
    },
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd'
    },
    //
    // Options to be passed to Jasmine.
    // See also: https://github.com/webdriverio/wdio-jasmine-framework#jasminenodeopts-options
    
};