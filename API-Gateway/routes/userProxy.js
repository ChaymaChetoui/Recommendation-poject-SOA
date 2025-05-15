const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use("/", (req, res, next) => {
  console.log("Requête vers /users reçue :", req.method, req.originalUrl);
  next();
});

router.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/users", // remplace tout par /api/users
    },
  })
);

module.exports = router;
