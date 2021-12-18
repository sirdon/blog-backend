const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const route = require("./routes/route");
//app
const app = express();

// db
mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
  },
  function (err) {
    if (err) {
      console.log("DB connection fail", err);
    } else {
      console.log("DB Connected successfully");
    }
  }
);
//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
//cors
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//route
app.get("/healthcheck", (req, res) => {
  res.send({
    timestamp: new Date().getTime(),
    success: true,
  });
});

//route middleware
app.use("/api", route);
//port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("listening on port " + port);
});
