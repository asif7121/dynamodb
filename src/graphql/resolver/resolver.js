import { addUser } from "../../module/auth/controller/index.js";
import { getAllUsers } from "../../module/me/controller/getAllUsers.js";
import { getUser } from "../../module/me/controller/getUser.js";
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductOwner,
} from "../../module/product/controller/index.js";

// Define resolvers
export const resolvers = {
  Query: {
    getAllUsers: getAllUsers,
    getUser: getUser,
    getAllProducts: getAllProducts,
    getProduct: getProduct,
  },
  Mutation: {
    addUser: addUser,
    createProduct: createProduct,
  },
    Product: {
        createdBy: async(product) => {
            const {data} = await getProductOwner( product.createdBy )
            return data
      },
    },
  //   Order: {
  //     orderedBy: () => {},
  //     orderedItems: () => {},
  //   },
};
