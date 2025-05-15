const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemRoutes = require("./routes/item.routes");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/recommendation_items", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Item service listening on http://localhost:${PORT}`);
});
