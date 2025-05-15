const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel"); // Importation du modèle

const app = express();
app.use(express.json()); // Permet d'analyser le corps des requêtes JSON

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/kafka_messages", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));

// Route pour inscrire un utilisateur
app.post("/api/users", async (req, res) => {
  const { name, email, preferences } = req.body;

  try {
    const newUser = new User({ name, email, preferences });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});

// Route pour lister tous les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});

// Route pour récupérer les préférences d'un utilisateur
app.get("/api/users/:id/preferences", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.status(200).json(user.preferences);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});


// Route pour mettre à jour les préférences d'un utilisateur
app.put("/api/users/:id/preferences", async (req, res) => {
  const userId = req.params.id;
  const { preferences } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});

// Démarrer le serveur sur le port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});
