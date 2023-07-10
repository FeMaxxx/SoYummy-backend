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
    ownRecipes: { type: [String], default: [] },
    favorite: { type: [String], default: [] },
    shoppingList: { type: [Object], default: [] },
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
    subscribe: { type: Boolean, default: false },
    token: { type: String, default: "" },
  },
  { versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const changeNameSchema = Joi.object({
  name: Joi.string().min(2).required(),
});

export const User = model("user", userSchema);

export const schemas = {
  authSchema,
  changeNameSchema,
};
