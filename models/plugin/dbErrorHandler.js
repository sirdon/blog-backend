function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
let getError = function (error, res, next) {
  if (
    (error.name === "MongoError" || error.name == "MongoServerError") &&
    error.code === 11000
  ) {
    let field = error.message.split(" dup key")[0];

    field = field.split("index: ")[1];

    // field = field.substring(0, field.indexOf("collation"));
    field = field.split("_1");
    field = field.map((m) => capitalizeFirstLetter(m));
    let errArr = error.message.split('"');
    // console.log("field - ", field);
    // console.log("message - ", errArr);
    if (errArr[1] && errArr[1].length) {
      next(new Error("An entry with " + field + " already exists."));
    } else {
      next(new Error(error.message));
    }
  } else if (error.name === "ValidationError") {
    let errors = error["errors"];
    errors = Object.values(errors);
    let errMsg = errors.map((el) => {
      let message = el.message;
      console.log(el.value);
      if (el.name == "CastError") {
        message = `${capitalizeFirstLetter(el.path)} must be of ${
          el.kind
        } type`;
      }
      if (
        el.name == "ValidatorError" &&
        el.message.includes("Path") &&
        el.kind == "required"
      ) {
        message = `${capitalizeFirstLetter(el.path)} is required`;
      }
      return message;
    });
    next(new Error(errMsg.join(", ")));
  } else if (error.name === "CastError") {
    let message =
      `${capitalizeFirstLetter(error.path)} : ` +
      error.value +
      " is not a " +
      error.kind;
    next(new Error(message));
  } else {
    next();
  }
};

module.exports = exports = function handleError(schema, options) {
  let types = [
    "save",
    "insertOne",
    "insertMany",
    "update",
    "updateOne",
    "replaceOne",
    "updateMany",
    "findOneAndUpdate",
    "findByIdAndUpdate",
  ];
  types.forEach((el) => {
    schema.post(el, getError);
  });
};
