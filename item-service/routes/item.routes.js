const express = require("express");
const router = express.Router();
const Item = require("../models/item.model");

router.post("/", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});
router.get("/title/:title", async (req, res) => {
  try {
    const item = await Item.findOne({ title: req.params.title });
    if (!item) {
      return res.status(404).json({ message: "Item non trouvé" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});



router.get("/", async (req, res) => {
  console.log("GET /api/items called");
  const items = await Item.find();
  res.json(items);
});
router.get("/test", (req, res) => {
  res.send("Item routes working!");
});
module.exports = router;
