
describe('Demo test Ecosia.org', function() {
    test('search for nightwatch', function(browser) {
      browser
        .url('https://geo-quiz.xyz')
        .waitForElementVisible('body')
        .assert.titleContains('GeoQuiz')
        .end();
    })
  });