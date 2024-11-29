const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generatetoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownes-model");
const productModel = require("../models/product-modle");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      req.flash("error", "User already exists");
      return res.redirect("/register");
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
    return res.redirect("/register");
  } catch (error) {
    req.flash("error", "Something Went wrong");
    return res.redirect("/register");

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
      return res.redirect("/register");
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/register");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/");
    } else {
      req.flash("error", "Invalid email or password");
      return res.redirect("/register");
    }
  } catch (err) {
    // console.error("Error in loginUser:", err.message);
    // res.status(500).send("Server error");
    req.flash("error", "Something went wrong");
    return res.redirect("/register");
  }
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};

module.exports.createowner = async function (req, res) {
  try {
    const { fullname, email, Password } = req.body;

    if (!fullname || !email || !Password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/owner/createowner");
    }

    if (typeof Password !== "string") {
      req.flash("error", "Password must be a valid string.");
      console.log("Password must be a valid string.");
      // return res.redirect("/owner/createowner");
    }

    // Check if an owner already exists
    let owners = await ownerModel.find();
    if (owners.length > 0) {
      req.flash("error", "An owner already exists.");
      return res.status(503).send("You Don't have the permission.");
    }

    const saltRounds = 10; // Adjust salt rounds as needed
    const hashedpassword = await bcrypt.hash(Password, saltRounds);

    // Create the owner
    let createdOwner = await ownerModel.create({
      fullname,
      email,
      Password: hashedpassword,
    });

    res.send(createdOwner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.ownerlogin = async function (req, res) {
  try {
    const { email, Password } = req.body;

    if (!email || !Password) {
      req.flash("error", "Email or Password are required.");
      return res.redirect("/owner/ownerlogin");
    }

    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/owner/ownerlogin");
    }

    const isMatch = await bcrypt.compare(Password, owner.Password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/owner/ownerlogin");
    }

    const token = jwt.sign({ _id: owner._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.cookie("ownerToken", token, { httponly: true });
    req.flash("success", "Successfully logged in ");
    return res.redirect("/owner/createproduct");
    // res.status(200).send("Logged in successfully.");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error");
    // res.status(500).send("Internal Server Error");
  }
};

module.exports.ownerlogout = async function (req, res) {
  try {
    res.clearCookie("ownerToken", { httponly: true });

    req.flash("success", "Successfully logged out");
    res.redirect("/owner/ownerlogin");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    return res.redirect("/owner/ownerlogin");
  }
};
