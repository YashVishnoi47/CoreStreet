const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownes-model");


module.exports = async function (req,res,next) {
    try{
        const token = req.cookies.ownerToken

        if(!token){
            return req.flash("error","Access denied to owner token");
        };


        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const owner = await ownerModel.findById(decoded._id);
        
           


                if(!owner) {
                    return req.flash("error","Access denied on owner ");
                };

                req.owner = owner;
                next();



    }catch(error) {
        // console.error("Error in isOwner middleware:", error);
        req.flash("error","Access denied");
        res.redirect("/owner/ownerlogin");
    };
};