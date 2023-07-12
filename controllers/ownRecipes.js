import { ctrlWrapper } from "../helpers/index.js";
import { Recipe } from "../models/recipe.js";

const get = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const total = await Recipe.countDocuments({ owner: _id });
  const recipes = await Recipe.find({ owner: _id }).skip(skip).limit(limit);

  res.status(201).json({ recipes, total });
};

export const ctrl = {
  get: ctrlWrapper(get),
};
