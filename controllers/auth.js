const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = async (req , res) => {
    const userExists = await User.findOne({email : req.body.email});
    if(userExists){return res.status(403).json({
        error : "Email Id taken!"
        });
    }
        let user = null;
    try{
        user = new User(req.body);
        await user.save();
    }
    catch(err){
        res.status(400).json({
            error : `${err.message}`
        });
    };
    
    res.status(200).json({
        success : "User signup successful"
    });
}


exports.signin = async(req , res) =>{
    const {email,password} = req.body;
    User.findOne({email},function(err , user){
        if(err || !user){
            return res.status(401).json({
                error : "Provided email Id is not registered!"
            });
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "Incorrect password!"
            });
        }
        
        const token = jwt.sign({_id : user._id},process.env.JWT_SECRET);
        res.cookie('token',token,{expire : new Date() + 9999});
        const {name,email} = user;
        return res.status(200).json({token,user : {name,email}});
        
    });
}

exports.signout =(req,res)=>{
    res.clearCookie("token");
    return res.json({
        success : "Signed out successfully"
    });
}


exports.authRequired = (req,res,next) => {
    if(undefined==req.headers.authorization){
        return res.status(403).json({
            error : "Unauthorized"
        });
    }
	const token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
            return res.status(401).json({
                error : "Authentication failed!"
            });
		}
		User.findById(decoded._id).exec((err,user)=>{
			if(err || !user){
				return res.status(401).json({
					error : "User not found!"
				});
			}
			req.requestSender = user;
			next();
		});
	   });
	
}