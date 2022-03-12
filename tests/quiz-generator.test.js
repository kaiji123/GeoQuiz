const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const quiz = require('../quiz-generator.js')
const should = chai.should();
const expect = chai.expect;



describe('quiz-generator.pickRandom', () => {
    it('pick random test', done => {
        s = quiz.pickRandom([1,2,3])
        expect([1,2,3]).to.include(s)
        s =quiz.pickRandom([true,false])
        expect([true, false]).to.include(s)
        done();
    });
});




describe('ratings', () => {
    it('random ratings test', done => {
        s = quiz.randomRatings()
        for(i = 0 ; i < 3; i++){
            expect(s[i] > 2 && s[i] <=5).to.be.true
        }
       
        done();
    });
});



describe('array to csv', () => {
    it('array to csv test', done => {
        s = quiz.arrayToCsv([1,2,3,4,5]);
        expect(s).to.equal("1,2,3,4,5")

       
        done();
    });
});


describe('questionJson', () => {
    it('questionJson test', done => {
        s = quiz.questionJson("what is the place", "London", "Berlin", [1,2], "image");
        console.log(s)
        expect(s).to.deep.equal({question : "what is the place", answer: "London", wrong: "Berlin", metadata : [1,2],type: "image" })
        
    
        done();
    });
});











