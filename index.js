import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { listTables } from "./db.js";
import { typeDefs } from "./src/graphql/schema/schema.js";
import { resolvers } from "./src/graphql/resolver/resolver.js";


async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  // Start the server
  await server.start();

  app.use(express.json());
  // Middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      //   context: async ({ req }) => ({ token: req.headers.authorization }),
    })
  );
  (async () => {
    console.log("Connecting to DynamoDB Local...");
    await listTables();
  })();
  // Run the Express server
  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}

startServer();
