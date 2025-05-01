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
              background: url('https://images.unsplash.com/photo-1614851099511-66c13c5f3d90?auto=format&fit=crop&w=1400&q=80') no-repeat center center fixed;
              background-size: cover;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              color: #fff;
            }

            .container {
              background-color: #111;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 0 12px rgba(0,0,0,0.4);
              max-width: 500px;
              text-align: center;
            }

            .container h2 {
              font-size: 20px;
              margin-bottom: 25px;
              color: #ffffff;
            }

            .login-btn {
              display: inline-block;
              padding: 12px 24px;
              background: #007acc;
              color: #fff;
              font-weight: bold;
              font-size: 16px;
              border: none;
              border-radius: 6px;
              text-decoration: none;
              transition: background 0.3s ease;
            }

            .login-btn:hover {
              background: #005fa3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>"Access denied Use the official login page"</h2>
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