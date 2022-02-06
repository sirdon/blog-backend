const express = require("express");
const router = express.Router();
const {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  photo
} = require("../controller/blog");
const { requireSignin, adminMiddleware } = require("../controller/auth");
const { runValidation } = require("../validators");
router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blogs/:slug", read);
router.delete("/blogs/:slug", requireSignin, adminMiddleware, remove);
router.put("/blogs/:slug", requireSignin, adminMiddleware, update);
router.get("/blogs/photo/:slug", photo);

module.exports = router;
