const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownes-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isOwner = require("../middleware/IsOwner");
const productModel = require("../models/product-modle");
const {
  createowner,
  ownerlogin,
  ownerlogout,
} = require("../controllers/authControllers");

// owner Route

if (process.env.NODE_ENV === "development") {
  router.post("/create", createowner);
}

router.post("/ownerlogin", ownerlogin);
router.get("/ownerlogout", ownerlogout);

router.get("/ownerlogin", (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("owner-login", { error,success });
});



router.get("/createproduct", isOwner, function (req, res) {
  const success = req.flash("success");
  const isOwner = require("../middleware/IsOwner");
  res.render("createproducts", { success, isOwner });
});

router.get("/editproduct/:id",isOwner, async function(req,res){
  try {
    const productid = req.params.id;
    const product = await productModel.findOne({_id:productid, owner:req.owner._id});

    if(!product){
      return req.flash("error","Product not found");
    }

    const success = req.flash("success");
    const error = req.flash("error");
    res.render('editproduct',{product,success,error});

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});







router.post("/editproduct/:id",isOwner,async function(req,res){
  try {
    
    const productid = req.params.id;
    const {name,discount,price,bgcolor,panecolor,textcolor} = req.body;


    const updatedfield = {name,discount,price,bgcolor,panecolor,textcolor}

    // const updatedproduct = await productModel.findOneAndUpdate(
    //   {_id:productid,owner:req.owner._id},
    //   {name,price,discount,bgcolor,panecolor,textcolor},
    //   {new:true}
    // );

    const updatedproduct = await productModel.findByIdAndUpdate(
      productid,
      updatedfield,
      {new:true}
    );

    
    console.log("Product ID:", req.params.id);
    console.log("Updated Fields:", req.body);

    if(!updatedproduct){
      return req.flash("error","Product not found");
    };

    req.flash("success","Product updated successfully");
    res.redirect("/product/allproducts");

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
    req.flash("internal Server Error");
  }
});


router.post("/deleteproduct/:id", isOwner,async function(req,res){
  try {
    const productid = req.params.id;

    const deletedproduct = await productModel.findOneAndDelete({
      _id:productid,
      owner:req.owner._id
    });

    if(!deletedproduct){
      req.flash("error","Product not deleted")
    };

    req.flash("success","Product deleted successfully");
    res.redirect("/product/allproducts");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
    req.flash("error","Internal server Error, Product Not Deleted");
  }
});


module.exports = router;
