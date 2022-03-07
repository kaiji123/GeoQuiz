const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app.js');
const should = chai.should();
const expect = chai.expect;
// starwars mocks
describe('GET /api/top5', () => {
    it('api/top5 get error', done => {
      chai
        .request(app)
        .get('/api/top5')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.all.keys('name', 'scores')
          expect(res.body[0].name).to.be.a('string')
          done();
        });
    });
});

// post location test
describe('GET /api/location', () => {
    it('api/location post error', done => {
      chai
        .request(app)
        .post('/api/location')
        .send("-34.397,50.644")
        .end((err, res) => {
          res.should.have.status(200)
          console.log(res.body)
          expect(res.body).to.be.an("Object")
          done();
        });
    });
});