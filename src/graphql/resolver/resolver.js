import { addUser } from "../../module/auth/controller/index.js";
import { getAllUsers } from "../../module/me/controller/getAllUsers.js";
import { getUser } from "../../module/me/controller/getUser.js";
import {
  getAllOrders,
  getConsumer,
  getOrderedProducts,
  orderProducts,
} from "../../module/order/controller/index.js";
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
    getAllOrders: getAllOrders,
  },
  Mutation: {
    addUser: addUser,
    createProduct: createProduct,
    orderProducts: orderProducts,
  },
  Product: {
    createdBy: async (product) => {
      const { data } = await getProductOwner(product.createdBy);
      return data;
    },
  },
  Order: {
    orderedBy: async (order) => {
      const { data } = await getConsumer(order.orderedBy);
      return data;
    },
    items: async (order) => {
      const { data } = await getOrderedProducts(order.items);
      console.log(data);
      return data;
    },
  },
}
