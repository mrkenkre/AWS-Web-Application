const express = require("express");
const router = express.Router();
const {
  postassg,
  getassg,
  getallassg,
  putassg,
  invalidassg,
  deleteassg,
  submitassg,
} = require("../controller/assg");

router.post("/assignments", postassg);

router.get("/assignments/:id", getassg);
router.get("/assignments/", getallassg);

router.put("/assignments/:id", putassg);
router.put("/assignments/", putassg);

router.delete("/assignments/:id", deleteassg);
router.delete("/assignments/", deleteassg);

router.post("/assignments/:id/submission", submitassg);
router.post("/assignments//submission", submitassg);

router.all("/*", invalidassg);

module.exports = router;
