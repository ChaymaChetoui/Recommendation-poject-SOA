const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use(
  "/", // vérifier que le chemin est correct
  createProxyMiddleware({
    target: "http://localhost:4000", // pointage vers GraphQL Gateway
    changeOrigin: true,
    pathRewrite: {
      "^/": "/graphql", // Réécrit /graphql vers / du GraphQL Gateway
    },
  })
);

module.exports = router;
