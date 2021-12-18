const Tag = require("../models/tag");
const slugify = require("slugify");
exports.create = function (req, res) {
  Tag.findOne({ name: req.body.name }).exec((err, tag) => {
    if (tag) {
      return res.status(400).json({
        error: "tag already exists",
      });
    }
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    let newTag = new Tag({ name, slug });
    newTag.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.json(data);
    });
  });
};
exports.list = function (req, res) {
  Tag.find().exec((err, tag) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      res.status(200).json(tag);
    }
  });
};
exports.read = function (req, res) {
  let slug = req.params.slug.toLowerCase();
  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      res.status(200).json(tag);
    }
  });
};
exports.remove = function (req, res) {
  let slug = req.params.slug.toLowerCase();
  Tag.findOneAndDelete({ slug }).exec((err, tag) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else if (!tag) {
      res.status(400).json({ message: "Tag already deleted" });
    } else {
      res.status(200).json({ message: "Tag deleted", tag });
    }
  });
};
