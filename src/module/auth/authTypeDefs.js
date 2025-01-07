export const AuthTypeDefs = `#graphql

type User {
    id: ID!
    username: String!
    email: String!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
    authToken: String
}
  type UserResponse {
  statusCode: Int
  message: String
  error: String
  data: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!):UserResponse
    loginUser(email: String!, password: String!): UserResponse 
  }
`;