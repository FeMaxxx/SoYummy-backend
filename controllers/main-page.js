import { ctrlWrapper } from "../helpers/index.js";
import { Recipe } from "../models/recipe.js";

// const getRecipesByCategories = async (req, res) => {
//   console.log("butterfly");
//   const { page = 1, limit = 4 } = req.query;
//   const skip = (page - 1) * limit;
//   const categories = ["Breakfast", "Miscellaneous", "Chicken", "Dessert"];
//   const recipesPromises = categories.map(async (category) => {
//     const regexCategory = new RegExp(category, "i");
//     const recipes = await Recipe.find({ category: regexCategory })
//       .skip(skip)
//       .limit(limit);
//     return recipes;
//   });
//   const recipes = await Promise.all(recipesPromises);

//   res.status(200).json(recipes);
// };

const getRecipesByCategories = async (req, res) => {
  console.log("butterfly");
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  const categories = ["Breakfast", "Miscellaneous", "Chicken", "Dessert"];

  const recipesByCategories = {};

  const recipesPromises = categories.map(async (category) => {
    const regexCategory = new RegExp(category, "i");
    const recipes = await Recipe.find({ category: regexCategory })
      .skip(skip)
      .limit(limit);
    recipesByCategories[category] = recipes;
  });

  await Promise.all(recipesPromises);

  res.status(200).json(recipesByCategories);
};

export const ctrl = {
  getRecipesByCategories: ctrlWrapper(getRecipesByCategories),
};
