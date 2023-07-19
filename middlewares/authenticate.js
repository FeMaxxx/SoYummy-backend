import { HttpError } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const { ACCESS_SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || token === "") next(HttpError(403));

  try {
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.accessToken || user.accessToken !== token) next(HttpError(401));

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    req.user = userWithoutPassword;
    next();
  } catch {
    console.log("err");

    next(HttpError(401));
  }
};
