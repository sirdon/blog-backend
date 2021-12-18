const Category = require("../models/category");
const slugify = require("slugify");
exports.create = function (req, res) {
  Category.findOne({ name: req.body.name }).exec((err, category) => {
    if (category) {
      return res.status(400).json({
        error: "category already exists",
      });
    }
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    let newCategory = new Category({ name, slug });
    newCategory.save((err, data) => {
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
  Category.find().exec((err, category) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      res.status(200).json(category);
    }
  });
};
exports.read = function (req, res) {
  let slug = req.params.slug.toLowerCase();
  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else {
      res.status(200).json(category);
    }
  });
};
exports.remove = function (req, res) {
  let slug = req.params.slug.toLowerCase();
  Category.findOneAndDelete({ slug }).exec((err, category) => {
    if (err) {
      res.status(400).json({ err, message: err.message });
    } else if (!category) {
      res.status(400).json({ message: "Category already deleted" });
    } else {
      res.status(200).json({ message: "Category deleted", category });
    }
  });
};
