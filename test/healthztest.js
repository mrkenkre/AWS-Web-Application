const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app here
const expect = chai.expect;
// const sequelize = require("../config/sequelize");

chai.use(chaiHttp);

// describe("/Check database connection", () => {
//   it("should return status 200 and success message", async (done) => {
//     try {
//       await sequelize.authenticate();
//       done();
//       console.log("Connection successful.");
//       process.exit(0);
//     } catch (error) {
//       console.log("Connection NOT successful." + error);
//       process.exit(1);
//     }
//   });
// });

describe("Healthz Endpoint", () => {
  it("should return a 200 status", async () => {
    const response = await chai.request(app).get("/healthz");

    expect(response.status).to.equal(200);
  });
});
