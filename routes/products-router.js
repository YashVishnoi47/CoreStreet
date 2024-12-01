const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-modle");
const ownerModel = require("../models/ownes-model");
const userModel = require("../models/user-model");
const isowner = require("../middleware/IsOwner");
const isloggedin = require("../middleware/isloggedin");
const reviewModel = require("../models/review-model");

router.post(
  "/create",
  isowner,
  upload.single("image"),
  async function (req, res) {
    try {
      let { name, discount, price, bgcolor, panecolor, textcolor } = req.body;

      let newProduct = await productModel.create({
        image: req.file.buffer,
        name,
        discount,
        price,
        bgcolor,
        panecolor,
        textcolor,
        owner: req.owner._id,
      });

      if (!name || !discount || !price || !bgcolor || !textcolor) {
        req.flash("error", "All fields are required");
        return res.redirect("/owner/createproduct");
      }

      await ownerModel.findByIdAndUpdate(
        req.owner._id,
        { $push: { products: newProduct._id } },
        { new: true }
      );

      req.flash("success", "Product created successfully");
      res.redirect("/owner/createproduct");
    } catch (err) {
      console.error("Error creating product:", err.message); // Log the error
      res.send(err.message);
    }
  }
);

router.post("/:id/review", isloggedin, async function (req, res) {
  try {
    const { comment } = req.body;

    if (!comment) {
      req.flash("error", "Cannont post empty comment");
      return redirect(`/product/${req.params.id}/reveiw"`);
    }

    const product = await productModel.findById(req.params.id);
    const user = await userModel.findById(req.user._id);

    if (!product) {
      req.flash("error", "Product not found");
      console.log(error.message);
      return redirect("/shop");
    }

    const createdreview = await reviewModel.create({
      comment,
      user: req.user._id,
      product: product._id,
    });

    product.reviews.push(createdreview);
    await product.save();

    user.reviews.push(createdreview);
    await user.save();

    req.flash("success", "Review Posted");
    return res.redirect(`/product/${req.params.id}/review`);
  } catch (error) {
    req.flash("erroe", "Server side review Error (Catch)");
    console.log(error);
    return res.redirect("/shop");
  }
});

router.get("/:id/review", async function (req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    const reviews = await reviewModel
      .find({ product: product._id })
      .populate("user")
      .select("comment user");

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/shop");
    }
    const success = req.flash("success");
    const error = req.flash("error");

    res.render("product-reviews", {
      product,
      isloggedin,
      reviews,
      user: req.user,
      success,
      error,
    });
  } catch (error) {
    req.flash("error", "Internal Server Error");
    console.log(error.message);
    return res.redirect("/shop");
  }
});

router.get("/allproducts", isowner, async function (req, res) {
  try {
    const ownerid = req.owner._id;
    const products = await productModel.find({ owner: ownerid });

    const success = req.flash("success");
    const error = req.flash("error");
    res.render("ownerproducts", { products, error, success });
  } catch (error) {
    console.error("Error getting products:", error.message);
    res.status(404).send("Internal server error");
  }
});

// router.get("/selectedproducts",function(req,res){
//   const success = req.flash("success");
//     const error = req.flash("error");
//   res.render('selectedproduct',{success,error});

// });

router.get("/selectedproduct/:id", isloggedin, async function (req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    const user = await userModel.findById(req.user._id);
    const reviews = await reviewModel
      .find({ product: product._id })
      .populate("user", "fullname")
      .select("comment user");
    // console.log(user.fullname);

    if (!product) {
      return req.flash("error", "Product not found");
    }

    const success = req.flash("success");
    const error = req.flash("error");
    res.render("selectedproduct", {
      product,
      success,
      error,
      isloggedin,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
