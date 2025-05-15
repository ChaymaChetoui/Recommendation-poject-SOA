const User = require("../models/userModel");
const axios = require("axios");
const ITEM_SERVICE_URL = "http://localhost:3002/api/items";

const registerUser = async (req, res) => {
  try {
    const { name, email, preferences } = req.body;

    const validatedPreferences = [];

    for (const pref of preferences) {
      const { category, items } = pref;
      const itemIds = [];

      for (const title of items) {
        try {
          console.log("Recherche item pour le titre:", title);
          const response = await axios.get(`${ITEM_SERVICE_URL}/title/${encodeURIComponent(title)}`);
          const item = response.data;

          if (item && item._id) {
            itemIds.push(item._id);
          }
        } catch (err) {
          console.warn(`⚠️ Item non trouvé pour le titre : ${title}`);
        }
      }

      validatedPreferences.push({ category, items: itemIds });
    }

    const newUser = new User({ name, email, preferences: validatedPreferences });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Erreur création user:", error.message);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};
module.exports = { registerUser, getAllUsers };