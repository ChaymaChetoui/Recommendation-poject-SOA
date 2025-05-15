// activity-tracking-service/producer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "activity-tracker",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const sendActivity = async (activity) => {
  await producer.connect();
  await producer.send({
    topic: "user-activity",
    messages: [{ value: JSON.stringify(activity) }],
  });
  console.log("✅ Activité envoyée à Kafka:", activity);
  await producer.disconnect();
};

module.exports = { sendActivity };
