
describe('title test', function() {
    test('test', function(browser) {
      browser
        .url('https://geo-quiz.xyz')
        .waitForElementVisible('body')
        .assert.titleContains('GeoQuiz')
        .end();
    })
  });

  describe('play button visible', function (){
    it('demo test', function(browser) {
      browser
        .url('https://geo-quiz.xyz')
        .waitForElementVisible('body')
        .assert.elementPresent("#leaderboard")
        .assert.visible(".upper")
        .pause(3*1000)
        .end()
    });
  
  })