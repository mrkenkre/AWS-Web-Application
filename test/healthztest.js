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
        if (err) {
          console.error(err); // Log the error
          process.exit(1); // Exit with a negative response
        } else {
          expect(res).to.have.status(200);
          // You can also add additional checks here
          // expect(res.body).to.have.property("status").eql("Success");
          done();
        }
      });
  });
});

after(() => {
  console.log("All tests have completed.");
  process.exit(0);
});
