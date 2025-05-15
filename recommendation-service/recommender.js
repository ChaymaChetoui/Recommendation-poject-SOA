const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  itemIds: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ajouter un index sur userId pour améliorer les performances des recherches
recommendationSchema.index({ userId: 1 });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
