import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
import { Recipe } from "../models/recipe.js";

const add = async (req, res) => {
  const { _id, favorite } = req.user;
  const { recipeId } = req.params;

  const resultRecipe = await Recipe.findById(recipeId);
  if (resultRecipe.length === 0) {
    throw HttpError(404, "Recipe not found");
  }

  const recipeInFavorite = favorite.some((el) => el === recipeId);
  if (recipeInFavorite) {
    throw HttpError(409, "The recipe already added to favorite");
  }

  await User.findByIdAndUpdate(_id, { $push: { favorite: recipeId } });

  res.status(201).json("Recipe added to favorite");
};

const get = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { favorite } = req.user;
  const skip = (page - 1) * limit;
  const query = { _id: { $in: favorite } };
  console.log(query);

  const total = await Recipe.countDocuments(query);
  const recipes = await Recipe.find(query).skip(skip).limit(limit);

  res.status(200).json({ recipes, total });
};

const remove = async (req, res) => {
  const { _id, favorite } = req.user;
  const { recipeId } = req.params;

  const recipeInFavorite = favorite.some((el) => el === recipeId);
  if (!recipeInFavorite) {
    throw HttpError(409, "This recipe is not in your favorites");
  }

  await User.findByIdAndUpdate(_id, { $pull: { favorite: recipeId } });

  res.status(200).json("Recipe has been removed from favorite");
};

export const ctrl = {
  add: ctrlWrapper(add),
  get: ctrlWrapper(get),
  remove: ctrlWrapper(remove),
};
