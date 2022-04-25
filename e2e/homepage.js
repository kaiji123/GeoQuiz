module.exports = {
    'example flow': function (browser) {
        browser.url("https://geo-quiz.xyz/")
        browser.pause(1000)
        browser.click(".start-quiz")
        //additional steps
        browser.end();
    },
};