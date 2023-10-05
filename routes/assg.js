const express = require("express");
const router = express.Router();
const {
  postassg,
  getassg,
  getallassg,
  putassg,
  invalidassg,
  deleteassg,
} = require("../controller/assg");

router.post("/assignments", postassg);
router.get("/assignments/:id", getassg);
router.get("/assignments/", getallassg);
router.put("/assignments/:id", putassg);
router.delete("/assignments/:id", deleteassg);

router.all("/*", invalidassg);

module.exports = router;
