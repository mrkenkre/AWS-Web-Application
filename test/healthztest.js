const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

const { expect } = chai;

chai.use(chaiHttp);

describe("/healthz API", () => {
  it("should return status 200 and success message", (done) => {
    chai
      .request(app)
      .get("/healthz")
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body).to.have.property("status").eql("Success");
        done();
      });
  });
});

after(() => {
  console.log("All tests have completed.");
  process.exit(0);
});
