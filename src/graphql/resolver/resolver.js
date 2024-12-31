import { addUser } from "../../module/auth/controller/index.js";
import { getAllUsers } from "../../module/me/controller/getAllUsers.js";

// Define resolvers
export const resolvers = {
  Query: {
    getUsers:getAllUsers
  },
  Mutation: {
    addUser: addUser
  },
};
