// activity-tracking-service/server.js
const express = require("express");
const { sendActivity } = require("./producer");

const app = express();
app.use(express.json());

app.post("/activity", async (req, res) => {
  const activity = req.body;

  if (!activity || !activity.userId || !activity.type) {
    return res.status(400).json({ error: "userId et type requis" });
  }

  try {
    await sendActivity(activity);
    res.status(200).json({ message: "Activité envoyée avec succès" });
  } catch (err) {
    console.error("Erreur en envoyant l'activité:", err);
    res.status(500).json({ error: "Erreur Kafka" });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`🚀 Activity Tracking Service running on port ${PORT}`);
});
