import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
import { sendEmail } from "../services/index.js";
import dotenv from "dotenv";
dotenv.config();

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  const varifyEmail = {
    to: email,
    subject: "Veridy email",
    html: `<a target="_blank" href="tsylepa.github.io/Yummy/verification/${verificationCode}" >Click verify email</a>`,
  };
  await sendEmail(varifyEmail);
  await User.create({ ...req.body, password: hashPassword, verificationCode });

  res.status(201).json("Verify your email to complete the registration");
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const findUser = await User.findOne({ verificationCode });
  if (!findUser) {
    throw HttpError(401, "User not found");
  }

  const token = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "10h" });
  const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "2m" });
  const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const user = await User.findByIdAndUpdate(
    findUser._id,
    { verifiedEmail: true, verificationCode: "", token, accessToken, refreshToken },
    { new: true }
  );

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  res.status(200).json(userWithoutPassword);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw HttpError(401, "Email or password invalid");
  }
  // if (!findUser.verifiedEmail) {
  //   throw HttpError(401, "Email is not verified");
  // }

  const passwordCompare = await bcrypt.compare(password, findUser.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const token = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "10h" });
  const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "2m" });
  const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const user = await User.findByIdAndUpdate(
    findUser._id,
    { token, refreshToken, accessToken },
    { new: true }
  );

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  res.status(200).json(userWithoutPassword);
};

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;

  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Token invalid");
    }

    const accessToken = jwt.sign({ id }, ACCESS_SECRET_KEY, { expiresIn: "2m" });
    const refreshToken = jwt.sign({ id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
    await User.findByIdAndUpdate(id, { refreshToken, accessToken });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "", accessToken: "", refreshToken: "" });
  res.json({
    message: "Logout success",
  });
};

export const ctrl = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  refreshToken: ctrlWrapper(refreshToken),
  logout: ctrlWrapper(logout),
};
