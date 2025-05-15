const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const mongoose = require("mongoose");
const Recommendation = require("./recommender");
const runConsumer = require("./consumer"); // Import du consumer Kafka

const PROTO_PATH = path.join(__dirname, "proto", "recommendation.proto");

// Charger le fichier proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition);
const recommendationProto = proto.recommendation;

// 🧠 Implémentation de la méthode GetRecommendations
async function getRecommendations(call, callback) {
  const userId = call.request.userId;
  console.log(`📨 Requête reçue pour userId: ${userId}`);

  try {
    const reco = await Recommendation.findOne({ userId });

    if (!reco) {
      console.log(`ℹ️ Aucune recommandation trouvée pour ${userId}`);
      return callback(null, { userId, itemIds: [] });
    }

    callback(null, {
      userId: reco.userId,
      itemIds: reco.itemIds,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des recommandations:", error);
    callback(error);
  }
}

// 🛠 Connexion MongoDB
async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/recommendation-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connexion MongoDB établie.");
}

// 🚀 Fonction principale propre
async function main() {
  try {
    await connectDB();           // Connexion Mongo
    await runConsumer();         // Lancer le Kafka consumer

    const server = new grpc.Server();
    server.addService(recommendationProto.RecommendationService.service, {
      GetRecommendations: getRecommendations,
    });

    server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
      console.log("🚀 Recommendation gRPC server running at localhost:50051");
      server.start();
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage du serveur:", error);
    process.exit(1);
  }
}

main(); // Démarrer tout
