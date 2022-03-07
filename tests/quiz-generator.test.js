const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const quiz = require('../quiz-generator.js')
const should = chai.should();
const expect = chai.expect;


describe('pick', () => {
    it('api/top5 get error', done => {
        s = quiz.pickRandom([1,2,3])
        expect([1,2,3]).to.include(s)
        done();
    });
});