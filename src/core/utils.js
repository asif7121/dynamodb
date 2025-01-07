import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'secret'
const TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '1d'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (payload) => {
  const { id } = payload;
    const token = jwt.sign( { id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY } );
    return token
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
