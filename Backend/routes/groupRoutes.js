const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createNewGroup, getGroups, getGroupDetails } = require('../controllers/groupsController');
const router = express.Router();

router.post('/createGroup', verifyToken, createNewGroup);
router.get('/getGroups',verifyToken, getGroups);
router.get('/getGroupDetails/:groupID', verifyToken, getGroupDetails);

module.exports = router;