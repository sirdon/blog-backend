const express = require("express");
const router = express.Router();
const { create } = require("../controller/blog");
const { requireSignin, adminMiddleware } = require("../controller/auth");
const { runValidation } = require("../validators");
router.post("/blog", requireSignin, adminMiddleware, create);

module.exports = router;
