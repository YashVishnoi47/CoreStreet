const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownes-model");

// owner Route
if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    try {
      // Check if an owner already exists
      let owners = await ownerModel.find();
      if (owners.length > 0) {
        return res.status(503).send("You Don't have the permission.");
      }

      // Destructure the body
      let { fullname, email, Password } = req.body;

      // Create the owner
      let createdOwner = await ownerModel.create({
        fullname,
        email,
        Password,
      });

      res.send(createdOwner);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
}

router.get("/createproduct", function (req, res) {
  const success = req.flash("success");
  res.render("createproducts", { success });
});

module.exports = router;
