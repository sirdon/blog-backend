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

/**
 * @swagger
 * /signup:
 *  post:
 *    summary: Sign up using the current user
 *    responses:
 *      200:
 *        description: user signed up successfully
 *        content:
 *            application/json:
 *              schema:
 *                type: string
 *                items:
 *
 */
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
