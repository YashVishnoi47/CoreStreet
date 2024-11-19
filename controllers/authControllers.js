const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generatetoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      req.flash("error", "All fields are required");
      return res.redirect("/");
    }

    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      req.flash("error", "User already exists");
      return res.redirect("/");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user in the database
    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser);
    res.cookie("token", token);
    req.flash("error", "User Registered, Done");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", "Something Went wrong");
    return res.redirect("/");

    // console.error("Error in registerUser:", error.message);
    // res.status(500).send("Server error");
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      // return res.status(400).send("Email and password are required");
      req.flash("error", "Email and password are required");
      return res.redirect("/");
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      req.flash("error", "Invalid email or password");
      return res.redirect("/");
    }
  } catch (err) {
    // console.error("Error in loginUser:", err.message);
    // res.status(500).send("Server error");
    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};
