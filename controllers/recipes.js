import mongoose from "mongoose";
import { ctrlWrapper } from "../helpers/index.js";
import { Category, Recipe } from "../models/recipe.js";

const getRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  res.status(200).json(recipes);
};

const getRecipeById = async (req, res) => {
  const recipeId = req.query.category;
  const recipes = await Recipe.find({ recipeId });
  res.status(200).json(recipes);
};

const getCategoryList = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

const getRecipesByCategory = async (req, res) => {
  const category = req.query.category;
  const recipes = await Recipe.find({ category });
  res.status(200).json(recipes);
};

const getRecipesByIngredient = async (req, res) => {
  const ingredientId = req.query.ingredientId;
  // const recipes = await Recipe.find({ ingredients: { $in: [ingredientId] } });

  //   const recipes = await Recipe.find({
  //     ingredients: { $elemMatch: { id: { $in: [ingredientId] } } },
  //   });
  //   console.log(recipes);
  const ObjectId = mongoose.Types.ObjectId;

  const recipes = await Recipe.find({
    ingredients: {
      $elemMatch: {
        id: ObjectId(ingredientId),
      },
    },
  });
  res.status(200).json(recipes);
};

const addRecipe = async (req, res) => {
  const { _id: user } = req.user;
  const result = await Recipe.create({ ...req.body, user });
  res.status(201).json({ _id: result.id });
};

const deleteRecipeById = async (req, res) => {
  const { recipeId, userId } = req.params;
  const recipe = await Recipe.findById({ recipeId });
  if (recipe.user !== userId) {
    throw new HttpError(
      403,
      "This recipe was not created by you. You have got no rights to remove it."
    );
  }
  if (!recipe) {
    throw new HttpError(404, "No recipe found with that id");
  }
  await Recipe.findByIdAndDelete({ recipeId });
  res.status(200).json({ message: "Recipe deleted" });
};

// const uploadRecipeImage = async (req, res) => {
//   const locaFilePath = req.file.path;
//   const result = await cloudinary.uploader.upload(locaFilePath, {
//     folder: "avatars",
//     resource_type: "image",
//     quality: "auto",
//     fetch_format: "auto",
//     public_id: req.file.originalname,
//     format: "webp",
//     transformation: [{ width: 136, crop: "fill" }],
//   });

//   res.status(200).json({ url: result.secure_url });
// };

export const ctrl = {
  getRecipes: ctrlWrapper(getRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getCategoryList: ctrlWrapper(getCategoryList),
  getRecipesByCategory: ctrlWrapper(getRecipesByCategory),
  getRecipesByIngredient: ctrlWrapper(getRecipesByIngredient),
  addRecipe: ctrlWrapper(addRecipe),
  deleteRecipeById: ctrlWrapper(deleteRecipeById),

  //   uploadRecipeImage: ctrlWrapper(uploadRecipeImage),
};
