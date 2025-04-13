const express = require("express");
const request = require("request");
const app = express();

app.use("/", (req, res) => {
  const url = "http://82.151.73.56:8800" + req.url;
  req.pipe(request({ url })).pipe(res);
});

app.listen(3000, () => {
  console.log("Proxy server running on port 3000");
});
