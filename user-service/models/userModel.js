const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    preferences: [
      {
        category: String,
        items: [mongoose.Schema.Types.ObjectId], // stocker les IDs des items
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
