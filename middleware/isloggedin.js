const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
       req.flash("error", "You must be logged in");
    // return res.redirect("/register");
  }

  
    try {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      let user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");
      // req.user = user;
  
      if (user) {
        req.user = user; // Attach user data to the request
        req.isLoggedIn = true; // User is logged in
      } else {
        req.isLoggedIn = false; // Fallback in case user isn't found
      }
  
      next();
    } catch (error) {
      // req.flash("error", "you must be logged in");
      res.redirect("/");
    }
  }


