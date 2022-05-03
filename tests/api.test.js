const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

require('canvas')

const chaiHttp = require('chai-http');
chai.use(chaiHttp);



const app = require('../app.js');
const database = require("../routes/database.js")

// api/integration tests
describe('GET /leaderboard', () => {
    it('Should return a leaderboard object', done => {
      chai
        .request(app)
        .get('/api/v1/leaderboard')
        .then((res) => {
          res.should.have.status(200);
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.all.keys('name', 'total')
          expect(res.body[0].name).to.be.a('string')
        
        }).then(done());
    });
});



//  location test
describe('POST /api/v1/location', () => {
  it('Should return a JSON object containing city and country', done => {
    chai
      .request(app)
      .post('/api/v1/location')
      .send({ lat: 45.767, lon: 4.833 })
      .then((err, res) => {
        res.should.have.status(200)
        expect(res.body).should.have.property('data').that.includes.all.keys(['city','country'])
        done();
      }).then(done());
  });
});


// api/integration tests
describe('POST /api/v1/scores', () => {
  it('Should save a score to the database', done => {
    const prev = database.getScores()

    chai
      .request(app)
      .post('/api/v1/scores')
      .send({ score: 6, id: "1", percentage: 60 })
      .then((err, res) => {
        res.should.have.status(200);
        const cur = database.getScores()
        expect(cur).to.equal(prev+1)
        database.deleteScore(1);
      
      }).then(
        done());
  });
});


/*
//api/integration tests
describe('POST /api/add-user', () => {
  it('Should create a new user', done => {
    const prev = database.getUsers()
    chai
      .request(app)
      .post('/api/add-user')
      .send({ id: "9", name: "James Bond" })
      .then((err, res) => {
        res.should.have.status(200);
        const cur = database.getUsers()
        expect(cur).to.equal(prev+1)
        database.deleteUser("9");
      
      }).then(
        done());
  });
});

*/

