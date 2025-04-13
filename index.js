const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// حذف الحماية مؤقتًا
app.use("/", createProxyMiddleware({
  target: "http://82.151.73.56:8800",
  changeOrigin: true,
  ws: true,
  onError(err, req, res) {
    res.writeHead(500, {
      "Content-Type": "text/plain"
    });
    res.end("حدث خطأ في الاتصال بالخادم الهدف.");
  }
}));

app.listen(3000, () => {
  console.log("Proxy server running on port 3000");
});