const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generatetoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(401).send("User already exists");
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
    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token);
      res.send("Login successful!");
    } else {
      return res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).send("Server error");
  }
};
