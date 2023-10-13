const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app here
const expect = chai.expect;
const sequelize = require("../config/sequelize");

chai.use(chaiHttp);

describe("Check database connection", () => {
  it("should return status 200 and success message", (done) => {
    chai
      .request(app)
      .get("/healthz2") // Change this to the correct route path
      .end((err, res) => {
        if (err) {
          console.log("Connection NOT successful: " + err);
          return done(err);
          // process.exit(1);
        } else {
          expect(res).to.have.status(200);
          console.log("Connection successful.");
          done();
        }
      });
  });
});
