const express = require("express");
const app = express();
const userProxy = require("./routes/userProxy");
const itemProxy = require("./routes/itemProxy");
const graphqlProxy = require("./routes/graphqlProxy");

app.use(express.static("public"));

app.use("/users", userProxy);
app.use("/items", itemProxy);
app.use("/graphql", graphqlProxy);
// api-gateway/index.js (extrait)
const ACTIVITY_TRACKING_URL = "http://localhost:3000/activity";

app.post("/activity", async (req, res) => {
  try {
    const response = await fetch(ACTIVITY_TRACKING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur API Gateway => Activity Tracking:", err);
    res.status(500).json({ error: "Service indisponible" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
