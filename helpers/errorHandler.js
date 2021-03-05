const { UnauthorizedError } = require("express-jwt");

exports.errorHandler = (err , req , res , next) =>{
    //console.error(err.stack);
    if(err.name=="UnauthorizedError"){
        res.status(401).json({ error: "Unauthorized" });
    }
    else{
        res.status(500).json({ error: err.message });
    }
    next();
}