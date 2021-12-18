"use strict";

/**
 * Get unique error field name
 */

const uniqueMessage = (err) => {
  let output;
  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "already exists";
  } catch (error) {
    output = "Unique field already exists";
  }
  return output;
};
/**
 * Get the error message from error object
 */
exports.errorHandler = (err) => {
  let message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in err.errorors) {
      if (err.errorors[errorName].message)
        message = err.errorors[errorName].message;
    }
  }
  return message;
};
