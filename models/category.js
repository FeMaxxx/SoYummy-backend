import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import Joi from "joi";

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

export const Category = model("category", categorySchema);
