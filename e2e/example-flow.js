module.exports = {
    '@tags': ['example-flow'],
    'example flow': function (browser) {
        browser.pause(1000)
        const login = browser.page.login()
        //additional steps
        browser.end();
    },
};