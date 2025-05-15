const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/user_service", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connecté ✅");
  } catch (err) {
    console.error("Erreur de connexion à MongoDB ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;
