process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');

//let server = require("../src/server.js")

let should = chai.should();
const assert = require('assert');

chai.use(chaiHttp);

let app = "http://localhost:5555"
let basePath = "/v1/auth"

var data = require("./shared.js")

const application = require('../src/app')
const database = require('../src/database')
const { PORT } = process.env

const server = application.listen(PORT, () => {
  database.connect().then(() => {
  })
})


before(function () {
    server.on("listening", () => {
      done();
    })
});

/*after(function () {
  server.close();
});*/


//Create a user
describe("Ensure new user is working", () => {

  it("Create a new user", (done) => {
    chai.request(app)
      .post(basePath+'/register-local')
      .send({email: data.email, password: data.password})
      .end( (err, res) => {
        should.not.exist(err)
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.email.should.equal(data.email);
        data.user = res.body;
        done();
      })
    })

    it("log in with new user", (done) => {
      chai.request(app)
        .post(basePath+"/login-local")
        .send({email: data.email, password: data.password})
        .end( (err, res) => {
          should.not.exist(err)
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.user.should.not.be.empty;
          data.token = res.body.token;
          done()
          });
    })

    it("autologin with new user", (done) => {
      chai.request(app)
        .get(basePath+"/me")
        .set("authorization", data.token)
        .end( (err, res) => {
          should.not.exist(err)
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.email.should.equal(data.email)
          done();
      })
    })
});


//TODO logout