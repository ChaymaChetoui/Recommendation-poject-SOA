const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  category: String, // ex: movie, music, book
  description: String,
});

module.exports = mongoose.model("Item", itemSchema);
