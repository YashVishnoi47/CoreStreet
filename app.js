const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");
require("dotenv").config();



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(flash())
app.use(expressSession({
    resave: false,                 // Prevents unnecessary session resaving
    saveUninitialized: false,      // Does not save uninitialized sessions
    secret: process.env.SESSION_SECRET || 'fallback-secret-key', // Ensure a valid secret is always provided
    cookie: {
        httpOnly: true,            // Helps prevent cross-site scripting (XSS)
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24, // Session cookie expiry (1 day)
    },
}));

// ejs setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Import routes
const ownerRouter = require("./routes/owner-router");
const usersRouter = require("./routes/users-router");
const productsRouter = require("./routes/products-router");
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
