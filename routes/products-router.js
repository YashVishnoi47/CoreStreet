const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-modle");
const ownerModel = require("../models/ownes-model");
const isowner = require("../middleware/IsOwner");
const isloggedin = require("../middleware/isloggedin");

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
    const productid = req.params._id;
    const product = await productModel.findOne({ productid });
    // const product = await productModel.findByID(productid);

    if (!product) {
      return req.flash("error", "Product not found");
    }

    const success = req.flash("success");
    const error = req.flash("error");
    res.render("selectedproduct", { product, success, error, isloggedin });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/outofstock/:id", isowner, async function (req, res) {
//   try {
//     let product = await productModel.findOne({ id: req.params._id });

//     if (!product) {
//       req.flash("error", "Product not found");
//       return res.redirect("/product/allproducts");
//     }

//     product.outofstock = !product.outofstock;

//     await product.save();

//     req.flash(
//       "success",
//       product.outOfStock
//         ? "Product is now out of stock."
//         : "Product is back in stock."
//     );
//     res.redirect("/product/allproducts"); 
//   } catch (error) {
//     // console.error("Error toggling out of stock status:", err);
//     req.flash("error", "Failed to update stock status");
//     res.redirect("/product/allproducts");
//   }
// });

module.exports = router;
