import mongoose from "mongoose";
import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { Recipe } from "../models/recipe.js";
import { Category } from "../models/categories.js";
import { Ingredient } from "../models/ingredient.js";

const getRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  res.status(200).json(recipes);
};

const getRecipeById = async (req, res) => {
  const recipeId = req.params.recipeId;
  const recipe = await Recipe.findById(recipeId).lean();

  if (!recipe) {
    return res.status(404).json({ message: 'The recipe is not found' });
  }

  const ingredientIds = recipe.ingredients.map((ingredient) => ingredient.id);

  const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } }).lean();

  const updatedIngredients = recipe.ingredients.map((ingredient) => {
    const matchingIngredient = ingredients.find((item) => item._id.toString() === ingredient.id);
    return {
      id: matchingIngredient._id,
      measure: ingredient.measure,
      ...matchingIngredient
    };
  });

  recipe.ingredients = updatedIngredients;

  res.status(200).json(recipe);
};

const getCategoryList = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

const getRecipesByCategory = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;

  const category = new RegExp(req.params.category, "i");
  const recipes = await Recipe.find({ category }).skip(skip).limit(limit);

  res.status(200).json(recipes);
};

const getRecipesByTitle = async (req, res) => {
  const title = req.params.title;
  const regex = new RegExp(title, "i");

  const recipes = await Recipe.find(
    { title: { $regex: regex } },
    { _id: 0 }
  ).lean();

  res.status(200).json(recipes);
};

const getRecipesByIngredient = async (req, res) => {
  const ingredientId = req.params.ingredientId;
  const ObjectId = mongoose.Types.ObjectId;
  const recipes = await Recipe.find({
    ingredients: {
      $elemMatch: {
        id: new ObjectId(ingredientId),
      },
    },
  });
  res.status(200).json(recipes);
};

const addRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const {
    body: { title, description, category, time, ingredients, instructions },
    file,
  } = req;

  if (!file) throw HttpError(400, "Image is required");

  const data = {
    title,
    description,
    category,
    time,
    ingredients: JSON.parse(ingredients),
    instructions,
    thumb: file.path,
    preview: file.path,
    owner,
  };

  const result = await Recipe.create(data);

  res.status(201).json(result);
};

const deleteRecipeById = async (req, res) => {
  const { _id: userId } = req.user;
  const { recipeId } = req.params;
  const recipe = await Recipe.findById({ _id: recipeId });

  if (recipe.length === 0) {
    throw HttpError(404, "No recipe found with that id");
  }
  if (userId.toString() !== recipe?.owner?.toString()) {
    throw HttpError(
      403,
      "This recipe was not created by you. You have got no rights to remove it."
    );
  }

  await Recipe.findByIdAndDelete({ _id: recipeId });
  res.status(200).json({ message: "Recipe deleted" });
};

export const ctrl = {
  getRecipes: ctrlWrapper(getRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getRecipesByTitle: ctrlWrapper(getRecipesByTitle),
  getCategoryList: ctrlWrapper(getCategoryList),
  getRecipesByCategory: ctrlWrapper(getRecipesByCategory),
  getRecipesByIngredient: ctrlWrapper(getRecipesByIngredient),
  addRecipe: ctrlWrapper(addRecipe),
  deleteRecipeById: ctrlWrapper(deleteRecipeById),
};
