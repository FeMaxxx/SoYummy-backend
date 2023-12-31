import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";

const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<;>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: {
      type: String,
      require: true,
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    avatar: { type: String, default: "" },
    registerDate: { type: Date, default: new Date() },
    favorite: { type: [String], default: [] },
    shoppingList: { type: [Object], default: [] },
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
    subscribe: { type: Boolean, default: false },
    accessToken: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    verificationCode: { type: String, default: "" },
    verifiedEmail: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const changeNameSchema = Joi.object({
  name: Joi.string().min(2).required(),
});

const changeThemeSchema = Joi.object({
  theme: Joi.string().valid("light", "dark").required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const User = model("user", userSchema);

export const schemas = {
  registerSchema,
  loginSchema,
  changeNameSchema,
  changeThemeSchema,
  refreshTokenSchema,
};
