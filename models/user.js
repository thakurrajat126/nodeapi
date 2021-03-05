const mongoose = require('mongoose');
const uuid = require('uuidv1');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : "Name is mandatory",
        trim : true
    },
    email : {
        type : String,
        required : "Email is mandatory",
        validate: /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
        trim : true
    },
    hashed_password : {
        type : String,
        required : true
    },
    salt : String,
    created : {
        type : Date,
        default : Date.now
    },
    updated : Date
});

userSchema.virtual('password').
set(function(password){
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.encryptPassword(password);
}).
get(function(){
    return this._password;
});

userSchema.methods = {
    authenticate : function(password){
        return this.encryptPassword(password) == this.hashed_password;
    },
    encryptPassword : function(password){
        if(!password) return "";
        try{
            return crypto.createHmac('sha256',this.salt)
            .update(password)
            .digest('hex');
        }
        catch(err){
            return "";
        }
    }
}


module.exports = mongoose.model("User",userSchema);