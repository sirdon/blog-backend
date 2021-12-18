const express = require("express");
const router = express.Router();
const blogRouter = require("./blog");
const authRouter = require("./auth");
const userRouter = require("./user");
const categoryRouter = require("./category");
const tagRouter = require("./tag");

/**@Blog */
router.use(blogRouter);
/**@User */
router.use(userRouter);
/**@auth */
router.use(authRouter);
/**@category */
router.use(categoryRouter);
/**@tag */
router.use(tagRouter);
router.use("/msg", (req, res) => {
  res.status(200).json({ req });
});
module.exports = router;
