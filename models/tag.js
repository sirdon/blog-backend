const mongoose = require("mongoose");
const dbErrorHandler = require("./plugin/dbErrorHandler");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);
tagSchema.plugin(dbErrorHandler);
module.exports = mongoose.model("Tag", tagSchema);
