import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";

const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<;>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
  {
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
    avatar: String,
    registerDate: {
      type: Date,
      default: new Date(),
    },
    ownRecipes: {
      type: Date,
      default: new Date(),
    },
    favorite: {
      type: [String],
    },
    shoppingList: [
      {
        ingredientID: String,
        number: Number,
      },
    ],
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
    subscribe: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    token: String,
  },
  { versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const User = model("user", userSchema);

export const schemas = {
  authSchema,
};
