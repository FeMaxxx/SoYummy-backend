import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import queryString from "query-string";
import axios from "axios";
import { nanoid } from "nanoid";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
import { sendEmail } from "../services/index.js";
import dotenv from "dotenv";
dotenv.config();

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } =
  process.env;

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}api/auth/googleRedirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/auth/googleRedirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const findUser = await User.findOne({ email: userData.data.email });
  if (findUser) {
    const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "5m" });
    const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
    return res.redirect(
      `https://tsylepa.github.io/Yummy/googleRedirect?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }

  const newUSer = await User.create({
    name: userData.data.name,
    email: userData.data.email,
    password: "Google",
    verificationCode: "",
    verifiedEmail: true,
    accessToken: "",
    refreshToken: "",
  });

  const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "5m" });
  const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });

  await User.findByIdAndUpdate(newUSer._id, { accessToken, refreshToken });

  return res.redirect(
    `http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

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

  const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "5m" });
  const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const user = await User.findByIdAndUpdate(
    findUser._id,
    { verifiedEmail: true, verificationCode: "", accessToken, refreshToken },
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
    throw HttpError(403, "Email or password invalid");
  }
  if (!findUser.verifiedEmail) {
    throw HttpError(401, "Email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, findUser.password);

  if (!passwordCompare) {
    throw HttpError(403, "Email or password invalid");
  }

  const accessToken = jwt.sign({ id: findUser._id }, ACCESS_SECRET_KEY, { expiresIn: "5m" });
  const refreshToken = jwt.sign({ id: findUser._id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
  const user = await User.findByIdAndUpdate(
    findUser._id,
    { refreshToken, accessToken },
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

    const accessToken = jwt.sign({ id }, ACCESS_SECRET_KEY, { expiresIn: "5m" });
    const refreshToken = jwt.sign({ id }, REFRESH_SECRET_KEY, { expiresIn: "7d" });

    await User.findByIdAndUpdate(id, { accessToken, refreshToken });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });
  res.json({
    message: "Logout success",
  });
};

export const ctrl = {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  refreshToken: ctrlWrapper(refreshToken),
  logout: ctrlWrapper(logout),
};
