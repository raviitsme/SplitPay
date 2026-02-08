const express = require('express');
const { registerUser, loginUser, logoutUser, checkAuth } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', verifyToken, logoutUser);

router.get('/checkAuth', verifyToken, checkAuth);

module.exports = router