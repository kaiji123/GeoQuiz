module.exports = {
    'example flow': function (browser) {
        browser.url("https://geo-quiz.xyz/")
        browser.waitForElementVisible('.start-quiz')
        
        //additional steps
    },
};