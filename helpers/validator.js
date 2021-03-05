exports.validator = (req , res , next ) =>{

    const errors = req.validationErrors();
    if(errors){
        const firstError = errors[0].msg;
        return res.status(400).json({"error":firstError})
    }

    next();

}