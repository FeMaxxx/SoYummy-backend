import express from "express";
import { uploadRecipe } from "../middlewares/index.js";
import { ctrl } from "../controllers/recipes.js";

export const recipeRouter = express.Router();

recipeRouter.get("/", ctrl.getRecipes);
recipeRouter.get("/:recipeId", ctrl.getRecipeById);
recipeRouter.get("/main-page", ctrl.getRecipesByCategories);
recipeRouter.get("/search/:title", ctrl.getRecipesByTitle);
recipeRouter.get("/categories/:category", ctrl.getRecipesByCategory);
recipeRouter.get("/ingredients/:ingredientId", ctrl.getRecipesByIngredient);
recipeRouter.post("/", uploadRecipe.single("file"), ctrl.addRecipe);
recipeRouter.delete("/:recipeId", ctrl.deleteRecipeById);
