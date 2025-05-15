// recommendation-service/consumer.js
const { Kafka } = require("kafkajs");
const Recommendation = require("./recommender");

const kafka = new Kafka({
  clientId: "reco-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "recommendation-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-activity", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const activity = JSON.parse(message.value.toString());
      const { userId, itemId, type } = activity;

      console.log(`📥 Activité reçue de Kafka: ${userId} - ${itemId} - ${type}`);

      if (!userId || !itemId) return;

      try {
        // Ajoute l'item s’il n'existe pas déjà pour l'utilisateur
        await Recommendation.updateOne(
          { userId },
          { $addToSet: { itemIds: itemId } },
          { upsert: true }
        );

        console.log(`✅ Recommandation mise à jour pour ${userId}`);
      } catch (err) {
        console.error("❌ Erreur lors de la mise à jour des recommandations:", err);
      }
    },
  });
};

module.exports = runConsumer;
