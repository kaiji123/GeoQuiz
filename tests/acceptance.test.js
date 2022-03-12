const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app.js');
const should = chai.should();
const expect = chai.expect;

