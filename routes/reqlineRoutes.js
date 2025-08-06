
const express = require('express');
const { processReqline, healthCheck } = require('../controllers/reqlineController');
const { validateReqlineInput } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateReqlineInput, processReqline);

router.get('/health', healthCheck);

module.exports = router;