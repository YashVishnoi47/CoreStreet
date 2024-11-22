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
      };


      const { fullname, email, Password } = req.body;

      if (!fullname || !email || !Password) {
        req.flash('error',"All fields are required.")
        // return res.status(400).send("All fields (fullname, email, Password) are required.");
      }

      // Destructure the body
      // let { fullname, email, Password } = req.body;

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

router.get("/ownerlogin", function (req, res) {
  let error = req.flash("error");
  res.render("owner-login", { error,isLoggedIn: req.isLoggedIn, user: req.user });
  console.log(process.env.NODE_ENV)
});




router.get("/createproduct", function (req, res) {
  const success = req.flash("success");
  res.render("createproducts", { success });
});




module.exports = router;
