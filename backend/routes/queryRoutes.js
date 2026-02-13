const express = require('express');
const router = express.Router();
const { query } = require('../controllers/queryController');

router.post('/', query);

module.exports = router;
