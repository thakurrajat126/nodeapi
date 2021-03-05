//const jwt = require('express-jwt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

exports.allUsers = (req,res) => {
    User.find((err,users) => {
        if(err){
            return res.status(400).json({
            error : err
                })
        }

        res.json({users});
    }).select("name email updated created");
}

exports.deleteUser = (req,res) => {
    req.requestSender.remove((err,user) => {
        if(err){
            return res.status(400).json({
            error : err
                })
        }

        res.json({"success" : user.name+" , your account was deleted successfully."});
    });
}

exports.updateUser = (req,res) =>{
    let user = req.requestSender;
    user = _.extend(user,req.body);
    user.updated = Date.now();
    user.save((err,user)=>{
        if(!err){
            res.json({
                success:"Profile updated successfully"
            });
        }
    });
}
