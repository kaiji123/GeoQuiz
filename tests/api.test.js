const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app.js');
const should = chai.should();
const expect = chai.expect;
const database = require("./testQueries.js")

// api/integration tests
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

// post location test
describe('GET /api/location', () => {
  it('api/location post request 200', done => {
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

  it('api/location post error', done => {

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
describe('post /api/save-score', () => {
  it('save score success', done => {


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
describe('post /addUser', () => {
  it('add user success', done => {


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

