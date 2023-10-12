const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app here
const expect = chai.expect;

chai.use(chaiHttp);

describe("/healthz API", () => {
  it("should return status 200 and success message", (done) => {
    chai
      .request(app)
      .get("/healthz")
      .end((err, res) => {
        if (err) {
          console.error(err);
          process.exit(1);
        } else {
          expect(res).to.have.status(200);
          done();
          process.exit(0);
        }
      });
  });
});
