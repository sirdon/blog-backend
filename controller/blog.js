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
const mongoose = require("mongoose");
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
      blog.photo.contentType = files.photo.mimetype
    }
    blog.save((err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(result);
    });
  });
};
// list,listAllBlogsCategoriesTags,read,remove,update

exports.list = function (req, res) {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, blog) => {
      if (err) {
        res.status(400).json({ err, message: err.message });
      } else {
        res.status(200).json(blog);
      }
    });
};
exports.listAllBlogsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let blogs;
  let categories;
  let tags;
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({ err, message: err.message });
      } else {
        blogs = data;
        //get all categories
        Category.find({}).exec((err, c) => {
          if (err) {
            res.status(400).json({ err, message: err.message });
          } else {
            categories = c;
            //get all tags;
            Tag.find({}).exec((err, tag) => {
              if (err) {
                res.status(400).json({ err, message: err.message });
              } else {
                tags = tag;
                //return all blogs,categories,tags
                res.json({ blogs, categories, tags, size: blogs.length });
              }
            });
          }
        });
      }
    });
};

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .select(
      "_id title slug body mtitle mdesc photo categories tags postedBy createdAt updatedAt"
    ).exec((err, blog) => {
      if (err) {
        res.status(400).json({ err, message: err.message });
      } else {
        res.status(200).json(blog);
      }
    });
};
exports.photo = async (req, res) => {
  try {

    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
      .select(
        "_id photo"
      ).exec((err, blog) => {
        if (err) {
          res.status(400).json({ err, message: err.message });
        } else {
          res.set("Content-Type", blog.photo.contentType)
          return res.send(blog.photo.data);
        }
      });
  } catch (error) {
    res.status(400).json({ error, message: error.message })
  }
};
exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, blog) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      res.status(200).json({ message: "Blog deleted successfully" });
    }
  });
};
exports.update = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(400).json({
            error: "Image could not upload",
          });
        let slugBeforeMerge = oldBlog.slug;
        oldBlog = _.merge(oldBlog, fields)
        oldBlog.slug = slugBeforeMerge
        const { body, desc, categories, tags } = fields
        if (body) {
          oldBlog.excerpt = smartTrim(body, 100, " ", "...");
          oldBlog.mdesc = body.replace(/(<([^>]+)>)/gi, "").substring(0, 160);
        }
        if (categories) oldBlog.categories = categories.split(",");
        if (tags) oldBlog.tags = tags.split(",");

        if (files.photo) {
          if (files.photo.size > 10000000) {
            return res
              .status(400)
              .json({ error: "Image should be less than 1mb in size" });
          }
          oldBlog.photo.data = fs.readFileSync(files.photo.filepath);
          oldBlog.photo.contentType = files.photo.type;
        }
        oldBlog.save((err, result) => {
          if (err) return res.status(400).json({ error: err.message });
          result.photo = undefined
          res.json(result);
        });
      });
    }
  });

};
