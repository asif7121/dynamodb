export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }
type JwtToken {
  token: String
}
type UserWithToken {
    id: ID!
    username: String!
    email: String!
    password: String!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
    authToken: JwtToken
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
  enum OrderStatus {
   PENDING
   COMPLETED
   FAILED
  }
  type Order {
    id: ID!
    items: [Product!]!
    orderedBy: User!
    status: OrderStatus! # Enforcing one status at a time
    createdAt: String
    updatedAt: String
  }
  union UserData = User | UserWithToken
  type UserResponse {
  statusCode: Int
  message: String
  error: String
  data: UserData
}
  type ProductResponse {
    statusCode: Int
    message: String
    error: String
    data: Product
  }
  type OrderResponse {
    statusCode: Int
    message: String
    error: String
    data: Order
  }
  input OrderedProduct{
    id: ID!
    quantity: Int!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  type Query {
    getAllUsers: [User]
    getUser(id:String!): UserResponse
    getAllProducts: [Product]
    getProduct(id: String!): ProductResponse
    getAllOrders(orderedBy: String!): [Order]
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!):UserResponse
    loginUser(input: LoginInput!): UserResponse
    createProduct(name:String!, price:Int!,stock:Int!, userId:String!): ProductResponse
    orderProducts(products:[OrderedProduct!]!, userId: String):OrderResponse 
  }
`;
