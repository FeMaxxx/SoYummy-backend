import { Schema, model } from "mongoose";

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

const categorySchema = new Schema({
  category: {
    type: String,
    enum: categories,
    required: [true, "Category is required"],
  },
});

export const Category = model("category", categorySchema);
