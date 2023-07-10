import { ctrlWrapper } from "../helpers/index.js";
import { Ingredient } from "../models/ingredient.js";

const getIngredients = async (req, res) => {
  const ingredients = await Ingredient.find();
  res.status(200).json(ingredients);
};

const getIngredientsByName = async (req, res) => {
  const name = req.ingredient.name;
  const ingredients = await Ingredient.find({ name });
  res.status(200).json(ingredients);
};

export const ctrl = {
  getIngredients: ctrlWrapper(getIngredients),
  getIngredientsByName: ctrlWrapper(getIngredientsByName),
};
