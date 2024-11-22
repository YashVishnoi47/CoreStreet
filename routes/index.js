const express = require("express");
const router = express.Router();
const isloggedIn = require("../middleware/isloggedin");
const productModel = require("../models/product-modle");
const userModel = require("../models/user-model");


router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error,isLoggedIn: req.isLoggedIn, user: req.user });
});




router.get("/shop", isloggedIn, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop",{products,success,isLoggedIn: req.isLoggedIn, user: req.user});
});


router.get("/cart", isloggedIn, async function (req, res) {
  let user = await userModel
  .findOne({email: req.user.email})
  .populate("cart");
  let products = await productModel.find();
  res.render("cart",{isLoggedIn: req.isLoggedIn,products, user: req.user,user});
  // console.log(user);
});


router.get("/addtocart/:productid", isloggedIn, async function (req, res) {
  let user = await userModel.findOne({email:req.user.email});
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Product added to cart successfully");
  res.redirect("/shop");
});

module.exports = router;
