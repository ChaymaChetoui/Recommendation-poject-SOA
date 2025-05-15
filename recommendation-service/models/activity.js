const mongoose = require("mongoose");

// Définir le schéma pour l'activité utilisateur
const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // Exemple : 'click', 'like', etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
