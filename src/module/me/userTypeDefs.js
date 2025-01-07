export const UserTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }

  type UserResponse {
  statusCode: Int
  message: String
  error: String
  data: User
}
  type Query {
    getAllUsers: [User]
    getUser: UserResponse
  }
`;