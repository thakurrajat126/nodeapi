const express = require('express');
const user = require('../models/user');
const userController = require('../controllers/user');
const {authRequired} = require('../controllers/auth');


const router = express.Router();

router.get('/user/list',authRequired,userController.allUsers);
router.delete('/user/delete',authRequired,userController.deleteUser);
router.post('/user/update',authRequired,userController.updateUser);

module.exports = {router};
 