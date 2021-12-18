const Blog = require("../models/blog");
const formidable = require("formidable");
const slugify = require("slugify");
// const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const Category = require("../models/category");
const Tag = require("../models/tag");
const fs = require("fs");
const { isFunction } = require("lodash");
const { smartTrim } = require("../helpers/blog");
exports.create = function (req, res) {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({
        error: "Image could not upload",
      });
    let { title, body, categories, tags } = fields;
    if (categories) categories = categories.split(",");
    if (tags) tags = tags.split(",");
    if (!body || !body.length) {
      return res.status(404).json({ error: "Missing body" });
    }
    if (!title || !title.length) {
      return res.status(404).json({ error: "Missing title" });
    }
    if (!categories || !categories.length) {
      return res
        .status(404)
        .json({ error: "At least one category is required" });
    }
    if (!tags || !tags.length) {
      return res.status(404).json({ error: "At least one tag is required" });
    }
    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.slug = slugify(title).toLowerCase();
    blog.excerpt = smartTrim(body, 100, " ", "...");
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = body.replace(/(<([^>]+)>)/gi, "").substring(0, 160);
    blog.postedBy = req.user._id;
    blog.categories = categories;
    blog.tags = tags;
    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ error: "Image should be less than 1mb in size" });
      }
      blog.photo = "";
      blog.photo.data = fs.readFileSync(files.photo.filepath);
      blog.photo.contentType = files.photo.type;
    }
    blog.save((err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(result);
    });
  });
};
