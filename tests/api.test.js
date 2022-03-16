const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../app.js');
const database = require("../routes/database.js")

// api/integration tests
describe('GET /api/leaderboard', () => {
    it('Testing api/leaderboard', done => {
      chai
        .request(app)
        .get('/api/leaderboard')
        .then((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.all.keys('name', 'total')
          expect(res.body[0].name).to.be.a('string')
        
        }).then(done());
    });
});

//  location test
describe('POST /api/location', () => {
  it('Successful request', done => {
    chai
      .request(app)
      .post('/api/location')
      .send({ lat: 45.767, lon: 4.833 })
      .then((err, res) => {
        res.should.have.status(200)
        //console.log(res.body)
        expect(res.body).to.be.an("Object")
        done();
      }).then(done());
  });

  it('Unsuccesful request', done => {

    expect(
    chai
      .request(app) //request api
      .post('/api/location')
      .send({ lat: -888888, lon: -8888888 })
      .then((err, res) => {
        res.should.have.status(200)
        //console.log(res.body)
        expect(res.body).to.be.an("Object")
        done();
      }).then(done())).to.throw(Error); //throw error
  });
});


// api/integration tests
describe('POST /api/save-score', () => {
  it('Successful request', done => {
    const prev = database.getScores()

    chai
      .request(app)
      .post('/api/save-score')
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



// api/integration tests
describe('POST /addUser', () => {
  it('Successful user creation', done => {
    const prev = database.getUsers()
    chai
      .request(app)
      .post('/api/users')
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

