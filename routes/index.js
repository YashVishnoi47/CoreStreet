const express = require("express");
const router = express.Router();
const isloggedIn = require("../middleware/isloggedin");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error });
});

router.get("/shop", isloggedIn, function (req, res) {
  res.render("shop");
});

module.exports = router;
