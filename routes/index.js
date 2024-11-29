const express = require("express");
const router = express.Router();
const isloggedIn = require("../middleware/isloggedin");
const productModel = require("../models/product-modle");
const userModel = require("../models/user-model");

router.get("/",async function (req, res) {
  let error =  req.flash("error");
  let success =  req.flash("success");
  let products = await productModel.find()
  // let isLoggedIn = require("../middleware/isloggedin");
  // console.log("Is Logged In:", isLoggedIn);
  res.render("landingpage", {
    error,
    isLoggedIn :req.isloggedIn||false,
    user: req.user||null ,
    success,
    products,
  });

  
});

router.get("/register", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, isLoggedIn: req.isLoggedIn, user: req.user });
});

router.get("/shop", isloggedIn, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("shop", {
    products,
    success,
    error,
    isLoggedIn: req.isLoggedIn,
    user: req.user,
  });
});

router.get("/cart", isloggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  let products = await productModel.find();
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("cart", {
    isLoggedIn: req.isLoggedIn,
    products,
    user: req.user,
    user,
    success,
    error
  });
  // console.log(user);
});

router.get("/addtocart/:productid", isloggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });

  if(user.cart.includes(req.params.productid)){
    req.flash("success","Product already exists in the cart");
    return res.redirect("/shop");
  };

  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Product added to cart successfully");
  res.redirect("/");
});


router.get("/removefromcart/:productid",isloggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({email: req.user.email});

    user.cart = user.cart.filter(
      (productid)=> productid.toString() !==req.params.productid
    );
  
    await user.save();
    req.flash("success", "Product removed from the cart successfully");
    res.redirect("/cart");
  } catch (error) {
    console.error("Error removing product from cart:", error)
    req.flash("error", "Failed to remove product from cart");
    res.redirect("/cart");
  }
  
})

router.post("/deletecartproduct/:productid",isloggedIn,async function(req,res){
  try {
    const productid = req.params.productid;

    const deletetedcartproduct = await productModel.findOneAndDelete({productid: productid});

    if(!deletetedcartproducts){
      req.flash("error","Product not deleted")
      res.redirect("/cart")
      return;
    }
  } catch (error) {
    
  }
})

module.exports = router;
