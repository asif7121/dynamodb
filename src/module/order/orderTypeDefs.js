export const OrderTypeDefs = `#graphql

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
  type Query {
    getAllOrders: [Order]
  }
  type Mutation {
    orderProducts(products:[OrderedProduct!]!):OrderResponse 
  }
`;
