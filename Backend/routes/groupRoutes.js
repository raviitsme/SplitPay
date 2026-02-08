const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createNewGroup, getGroups } = require('../controllers/groupsController');
const router = express.Router();

router.post('/createGroup', verifyToken, createNewGroup);
router.get('/getGroups',verifyToken, getGroups);

module.exports = router;