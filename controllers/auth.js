import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  const { _id } = newUser;
  const token = jwt.sign({ id: _id }, SECRET_KEY, { expiresIn: "10h" });
  const user = await User.findByIdAndUpdate(_id, { token }, { new: true });

  res.status(201).json({ password, ...user.toJSON() });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, findUser.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const token = jwt.sign({ id: findUser._id }, SECRET_KEY, { expiresIn: "10h" });
  const user = await User.findByIdAndUpdate(findUser._id, { token }, { new: true });

  res.status(200).json({ password, ...user.toJSON() });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
};

export const ctrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
