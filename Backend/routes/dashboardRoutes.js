const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/stats', verifyToken, getDashboardStats);

module.exports = router;