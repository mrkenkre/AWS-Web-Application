const express = require('express');
const router = express.Router();
const { healthz } = require('../controller/healthcheck');

router.all('/healthz', healthz);

module.exports = router;
