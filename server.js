const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const route = require("./routes/route");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: "https://cace1119f7784674a5a3dd72610f5d63@o1207583.ingest.sentry.io/6341196",
  tracesSampleRate: 1.0,
});
const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});
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
//swagger
const options = require("./config/swagger");

const foo = (req, res) => {
  try {
    throw new Error("sentry test")
  } catch (error) {
    console.log(error)
    Sentry.captureException(error);
  } finally {
    transaction.finish()
  }
}
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
//route
app.get("/healthcheck", (req, res) => {
  foo(req, res);
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
