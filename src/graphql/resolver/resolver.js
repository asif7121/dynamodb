import { addUser, loginUser } from "../../module/auth/authResolvers.js";
import { getAllUsers, getUser } from "../../module/me/userResolvers.js";
import { getAllOrders, getConsumer, getOrderedProducts, orderProducts } from "../../module/order/orderResolvers.js";
import { createProduct, getAllProducts, getProduct, getProductOwner } from "../../module/product/productResolvers.js";


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
    loginUser: loginUser,
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
      return data;
    },
  },
};
