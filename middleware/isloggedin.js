const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  } catch (error) {
    req.flash("error", "you must be logged in");
    res.redirect("/");
  }
};
