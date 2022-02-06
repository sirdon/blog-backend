module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple Blog API",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  apis: ["./routes/*.js"],
};
