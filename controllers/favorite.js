import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const add = async (req, res) => {
  const { _id, favorite } = req.user;
  const { id } = req.body;

  // const resultRecipe = await Recipe.findBy(id);
  // if (resultRecipe.length === 0) {
  //   throw HttpError(404, "Recipe not found");
  // }

  const recipeInFavorite = favorite.some(el => el._id === id);
  if (recipeInFavorite) {
    throw HttpError(409, "The recipe already added to favorite");
  }

  await User.findByIdAndUpdate(_id, { $push: { favorite: id } });

  res.status(201).json("Recipe added to favorite");
};

const get = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { favorite } = req.user;
  const skip = (page - 1) * limit;

  const recipeInFavorite = favorite.some(el => el._id === id);
  if (!recipeInFavorite) {
    throw HttpError(404, "Recipe not found");
  }

  const query = { _id: { $in: ids } };
  // const total = await Recipe.countDocuments(query);
  // const recipes = await Recipe.find(query, "", {
  //   skip,
  //   limit,
  // });

  res.status(201).json({ recipes, total });
};

const remove = async (req, res) => {
  const { _id, favorite } = req.user;
  const { id } = req.body;

  const recipeInFavorite = favorite.some(el => el._id === id);
  if (!recipeInFavorite) {
    throw HttpError(409, "This recipe is not in your favorites");
  }

  await User.findByIdAndUpdate(_id, { $pull: { favorite: id } });

  res.status(201).json("Recipe remove from favorite");
};

export const ctrl = {
  add: ctrlWrapper(add),
  get: ctrlWrapper(get),
  remove: ctrlWrapper(remove),
};
