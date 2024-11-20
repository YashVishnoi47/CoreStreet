const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-modle");

router.post("/create", upload.single("image"), async function (req, res) {
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
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owner/createproduct");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
