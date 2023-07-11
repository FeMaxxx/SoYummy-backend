import { HttpError } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || token === "") next(HttpError(401));

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) next(HttpError(401));

    req.user = { password, ...user.toJSON() };
    next();
  } catch {
    next(HttpError(401));
  }
};
