const express = require('express');
const authController = require('../controllers/auth');
const validator = require('../helpers/validator')

const authRouter = express.Router();

const mw = (req,res,next) => {
	console.log("inside User router");
	next();
}

authRouter.post('/user/signup',authController.signup);
authRouter.post('/user/signin',authController.signin);
authRouter.get('/user/signout',authController.signout);


module.exports = {authRouter};