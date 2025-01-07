export const ProductTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }
  type Product {
    id: ID!
    name: String!
    price: Int!
    stock: Int!
    createdBy: User!
    createdAt: String
    updatedAt: String
  }

  type ProductResponse {
    statusCode: Int
    message: String
    error: String
    data: Product
  }

  type Query {
    getAllProducts: [Product]
    getProduct(id: String!): ProductResponse
  }
  type Mutation {
    createProduct(name:String!, price:Int!,stock:Int!): ProductResponse
  }
`;
