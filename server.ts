import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";

const typeDefs = `
  type Message{
    id: String!
    text: String!
  }
  type Query {
    messages: [Message!]!
  }
`;

const resolvers = {
  Query: {
    messages: () => prisma.messages()
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on http://localhost:4000"));
