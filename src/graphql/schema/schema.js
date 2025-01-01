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
    price: Int!
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
  type UserResponse {
  statusCode: Int
  message: String
  error: String
  data: User
}
  type ProductResponse {
    statusCode: Int
    message: String
    error: String
    data: Product
  }
  type Query {
    getAllUsers: [User]
    getUser(id:String!): UserResponse
    getAllProducts: [Product]
    getProduct(id: String!): ProductResponse
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!):UserResponse
    createProduct(name:String!, price:Int!, userId:String!): ProductResponse
  }
`;
