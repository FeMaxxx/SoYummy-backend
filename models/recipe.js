import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";

const ingredientSchema = new Schema({
  id: {
    type: String,
    required: [true, "Ingredient id is required"],
  },
  measure: {
    type: String,
    required: [true, "Ingredient measure is required"],
  },
});
const categorySchema = new Schema({
  category: {
    type: String,
    enum: [
      "Beef",
      "Breakfast",
      "Chicken",
      "Dessert",
      "Goat",
      "Lamb",
      "Miscellaneous",
      "Pasta",
      "Pork",
      "Seafood",
      "Side",
      "Starter",
      "Vegan",
      "Vegetarian",
    ],
    required: [true, "Category is required"],
  },
});

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
    },
    description: {
      type: String,
      required: [true, "Recipe description is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "UserId is required"],
      ref: "user",
    },
    category: {
      type: String,
      enum: [
        "Beef",
        "Breakfast",
        "Chicken",
        "Dessert",
        "Goat",
        "Lamb",
        "Miscellaneous",
        "Pasta",
        "Pork",
        "Seafood",
        "Side",
        "Starter",
        "Vegan",
        "Vegetarian",
      ],
      required: [true, "Category is required"],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    thumb: {
      type: String,
      default: "blablabla cloudinary default image",
    },
    time: {
      type: String,
      required: [true, "Preparing time is required"],
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, "Ingredients are required"],
    },
  },
  { versionKey: false, timestamps: true }
);

recipeSchema.post("save", handleMongooseError);

const ingredientAddSchema = Joi.object().keys({
  name: Joi.string().required(),
  measure: Joi.string().required(),
});
const addSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  user: Joi.string().required(),
  category: Joi.string().required(),
  instructions: Joi.string().required(),
  thumb: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.array().items(ingredientAddSchema).required(),
});

// const updateRecipeImgSchema = Joi.object({
//   image: Joi.string().required(),
// });

export const Recipe = model("recipe", recipeSchema);
export const Category = model("category", categorySchema);
export const schemas = {
  addSchema,
  // updateRecipeImgSchema,
};
