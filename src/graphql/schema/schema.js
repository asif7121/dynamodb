export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
  }
  type Product {
    id: ID!
    name: String!
    price: String!
    createdBy: User!
    createdAt: String
    updatedAt: String
  }
  type Order {
    id: ID!
    items: [Product!]!
    orderedBy: User!
    createdAt: String
    updatedAt: String
  }
  type Query {
    getUsers: [User]
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): String
  }
`;
