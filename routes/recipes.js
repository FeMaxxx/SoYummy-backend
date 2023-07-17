import express from "express";
import { uploadRecipe } from "../middlewares/index.js";
import { ctrl } from "../controllers/recipes.js";

export const recipeRouter = express.Router();

recipeRouter.get("/", ctrl.getRecipes);
recipeRouter.get("/popular", ctrl.getPopularRecipes);
recipeRouter.get("/:recipeId", ctrl.getRecipeById);
recipeRouter.get("/search/:title", ctrl.getRecipesByTitle);
recipeRouter.get("/categories/:category", ctrl.getRecipesByCategory);
recipeRouter.get("/ingredients/:ingredientName", ctrl.getRecipesByIngredientName);
recipeRouter.post("/", uploadRecipe.single("file"), ctrl.addRecipe);
recipeRouter.delete("/:recipeId", ctrl.deleteRecipeById);
