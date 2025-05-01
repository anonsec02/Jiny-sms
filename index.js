const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use((req, res, next) => {
  const referer = req.get("referer") || "";
  const origin = req.get("origin") || "";
  const url = req.originalUrl;

  console.log("Incoming request:");
  console.log("Referer:", referer);
  console.log("Origin:", origin);
  console.log("Requested URL:", url);

  // السماح لصفحة معينة حتى لو لم يكن هناك Referer أو Origin
  const allowedPaths = ["/SubmitOKWithMenu.htm"];

  if (
    referer.includes("jiny-sms.pages.dev") ||
    referer.includes("jiny-sms.onrender.com") ||
    origin.includes("jiny-sms.pages.dev") ||
    origin.includes("jiny-sms.onrender.com") ||
    allowedPaths.includes(url)
  ) {
    console.log("Request allowed");
    next();
  } else {
    console.log("Request blocked");
    res.status(403).send(`
      <html>
        <head>
          <title>Access Blocked</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #0f0f0f, #1a1a1a, #000000);
              color: #f1f1f1;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-image: url('https://images.unsplash.com/photo-1602524206062-f56c7a407be9?auto=format&fit=crop&w=1400&q=80');
              background-size: cover;
              background-position: center;
              position: relative;
              overflow: hidden;
            }

            body::before {
              content: "";
              position: absolute;
              top: 0; left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.7);
              z-index: 0;
            }

            .container {
              position: relative;
              z-index: 1;
              background: rgba(20, 20, 20, 0.9);
              padding: 40px;
              border-radius: 15px;
              box-shadow: 0 0 20px #00ff88, 0 0 40px #005533;
              text-align: center;
            }

            .container h2 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #ff6666;
              text-shadow: 0 0 10px #aa0000;
            }

            .login-btn {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background: linear-gradient(90deg, #00c853, #64dd17);
              color: #fff;
              font-weight: bold;
              font-size: 18px;
              border: none;
              border-radius: 8px;
              text-decoration: none;
              box-shadow: 0 0 10px #00e676, 0 0 20px #00c853;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .login-btn:hover {
              transform: scale(1.05);
              box-shadow: 0 0 20px #00ff6f, 0 0 30px #00e676;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>dkhel mn chor login page walla khali 3anak chi ma ya3nik</h2>
            <a class="login-btn" href="https://jiny-sms.pages.dev">Login Page</a>
          </div>
        </body>
      </html>
    `);
  }
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