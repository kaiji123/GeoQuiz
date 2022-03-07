const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app.js');
const should = chai.should();
const expect = chai.expect;
// starwars mocks
describe('GET /api/top5', () => {
    it('api/top5 get test', done => {
      chai
        .request(app)
        .get('/api/top5')
        .then((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.all.keys('name', 'scores')
          expect(res.body[0].name).to.be.a('string')
        
        }).then(done());
    });
});
