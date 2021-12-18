const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controller/auth");

//  validators
const { runValidation } = require("../validators");
const {
  userSignupValidation,
  userSigninValidation,
} = require("../validators/auth");
router.post("/signup", userSignupValidation, runValidation, signup);
router.post("/signin", userSigninValidation, runValidation, signin);
router.get("/signout", signout);

//test
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    message: "access allowed",
    user: req.user,
  });
});
module.exports = router;
