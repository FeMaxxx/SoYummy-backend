import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";

const categories = [
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
];

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    thumb: String,
    preview: String,
    time: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [Object],
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

recipeSchema.post("save", handleMongooseError);

export const Recipe = model("recipe", recipeSchema);
