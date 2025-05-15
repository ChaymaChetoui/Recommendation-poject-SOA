const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3001;

connectDB();
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use((req, res, next) => {
  console.log("User-service reçu :", req.method, req.originalUrl);
  next();
});
app.listen(PORT, () => {
  console.log(`User-service est lancé sur http://localhost:${PORT}`);
});
