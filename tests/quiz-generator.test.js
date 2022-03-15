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
            expect(s[i] >= 1 && s[i] <=5).to.be.true
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
        //console.log(s)
        expect(s).to.deep.equal({question : "what is the place", answer: "London", wrong: "Berlin", metadata : [1,2],type: "image" })
        
    
        done();
    });
});



describe('generate quiz cache', () => {
    it('quiz cache',async() => {
        s = await quiz.generateQuizCache()
        expect(s).to.have.lengthOf(10)
        //console.log(s)
        for(let i =0;i <s.length; i++){
            expect(s[i]).to.have.property("question")
            expect(s[i]).to.have.property("answer")
            expect(s[i]).to.have.property("wrong")
            expect(s[i]).to.have.property("metadata")
            expect(s[i]).to.have.property("type")
        }
    
    });
});












