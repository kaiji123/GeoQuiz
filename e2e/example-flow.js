module.exports = {
    '@tags': ['example-flow'],
    'example flow': function (browser) {
        const login = browser.page.login()
        //additional steps
        browser.end();
    },
};