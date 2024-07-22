const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./route");

const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5174",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })
);

app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).send({
    status: "error",
    error: "Resource not found",
  });
});

app.listen(PORT, () => {
  console.log("Issues service is running on port 3000");
});
