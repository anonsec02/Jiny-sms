const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// حماية: لا تقبل إلا الطلبات القادمة من Cloudflare فقط
app.use((req, res, next) => {
  const referer = req.get("referer") || "";
  const origin = req.get("origin") || "";

  if (
    referer.includes("jiny-sms.pages.dev") ||
    origin.includes("jiny-sms.pages.dev")
  ) {
    next(); // واصل للوكالة
  } else {
    res.status(403).send("Access Denied");
  }
});

app.use("/", createProxyMiddleware({
  target: "http://82.151.73.56:8800",
  changeOrigin: true,
  ws: true, // لدعم WebSockets إذا كانت مطلوبة
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