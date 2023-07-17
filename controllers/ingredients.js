import { ctrlWrapper } from "../helpers/index.js";
import { Ingredient } from "../models/ingredient.js";

const getIngredients = async (req, res) => {
  const ingredients = await Ingredient.find();
  res.status(200).json(ingredients);
};

const getIngredientById = async (req, res) => {
  const ingredientId = req.params.ingredientId;
  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) {
    return res.status(404).json({ message: "The ingredient is not found" });
  }
  res.status(200).json(ingredient);
};

const getIngredientsByName = async (req, res) => {
  const name = req.ingredient.name;
  const ingredients = await Ingredient.find({ name });
  res.status(200).json(ingredients);
};

export const ctrl = {
  getIngredients: ctrlWrapper(getIngredients),
  getIngredientsByName: ctrlWrapper(getIngredientsByName),
  getIngredientById: ctrlWrapper(getIngredientById),
};

