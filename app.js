const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

// ejs setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Import routes
const ownerRouter = require("./routes/owner-router");
const usersRouter = require("./routes/users-router");
const productsRouter = require("./routes/porducts-router");
const indexRouter = require("./routes/index");
const db = require("./config/mongoose-connection");

// Routes
app.use("/users", usersRouter);
app.use("/owner", ownerRouter);
app.use("/product", productsRouter);
app.use("/", indexRouter);

// port
app.listen(3000);

module.exports = app;
