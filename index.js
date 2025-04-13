const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// إضافة السجلات لتتبع الطلبات
app.use((req, res, next) => {
  const referer = req.get("referer") || "";
  const origin = req.get("origin") || "";
  const urlPath = req.originalUrl;

  // تسجيل تفاصيل الطلب في الكونسول
  console.log("Incoming request:");
  console.log("Referer:", referer);
  console.log("Origin:", origin);
  console.log("Requested URL:", urlPath);

  // السماح إذا الطلب من Cloudflare أو مسار SubmitOKWithMenu.htm
  const fromCloudflare = referer.includes("jiny-sms.pages.dev") || origin.includes("jiny-sms.pages.dev");
  const isSubmitPage = urlPath.includes("SubmitOKWithMenu.htm");
  const isContinueURLPage = urlPath.includes("ContinueURL");

  if (fromCloudflare || isSubmitPage || isContinueURLPage) {
    console.log("Request allowed");
    return next();
  }

  // رفض أي شيء آخر
  console.log("Request blocked");
  res.status(403).send(`
    <html>
      <head>
        <title>Access Blocked</title>
      </head>
      <body style="font-family: Arial; background: #111; color: #eee; text-align: center; padding-top: 50px;">
        <h2>go to login page walla khali 3anak chi ma ya3nik</h2>
        <a href="https://jiny-sms.pages.dev" style="color: #0af; text-decoration: underline; font-size: 20px;">
          Go to Login Page
        </a>
      </body>
    </html>
  `);
});

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