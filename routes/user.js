const express = require("express");
const router = express.Router();
const { requireSignin, authMiddleware } = require("../controller/auth");
const { read } = require("../controller/user");

router.get("/profile", requireSignin, authMiddleware, read);

module.exports = router;
