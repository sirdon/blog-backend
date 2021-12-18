const { check } = require("express-validator");
exports.userSignupValidation = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Enter valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwords must be at least 6 characters long"),
];
exports.userSigninValidation = [
  check("email").isEmail().withMessage("Enter valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwords must be at least 6 characters long"),
];
