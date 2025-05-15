const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const axios = require("axios");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Chargement du schéma gRPC
const PROTO_PATH = path.join(__dirname, "proto", "recommendation.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition);
const recommendationProto = proto.recommendation;

// Créer un client gRPC
const client = new recommendationProto.RecommendationService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Schéma GraphQL
const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
  }

  type Item {
    id: String
    name: String
    description: String
  }

  type Recommendation {
    userId: String
    itemIds: [String]
  }

  type Query {
    getUser(id: String!): User
    getItem(id: String!): Item
    getRecommendations(userId: String!): Recommendation
    getRecommendationsByName(name: String!): Recommendation
  }
`;

// Résolvers
const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${id}`);
        return response.data;
      } catch (error) {
        console.error("Erreur dans getUser:", error);
      }
    },
    getItem: async (_, { id }) => {
      try {
        const response = await axios.get(`http://localhost:3002/api/items/${id}`);
        return response.data;
      } catch (error) {
        console.error("Erreur dans getItem:", error);
      }
    },
    
    getRecommendations: (_, { userId }) => {
      return new Promise((resolve, reject) => {
        client.GetRecommendations({ userId }, (error, response) => {
          if (error) {
            console.error("Erreur gRPC:", error);
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    },
  },
};

// Fonction async pour lancer le serveur
async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Gateway running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Démarrer
startServer();
