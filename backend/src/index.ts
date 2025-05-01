import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

dotenv.config();

const app = express();
app.use(cors());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  await server.applyMiddleware({ app: app as any });

  const PORT = process.env.PORT || 4000;
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://admin:todonepass@localhost:27017/todone";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🎯 Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(
        `📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();

