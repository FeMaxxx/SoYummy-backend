import express from "express";

import { authenticate, validateBody } from "../middlewares/index.js";
import { schemas } from "../models/recipe.js";
import { ctrl } from "../controllers/recipes.js";

export const recipeRouter = express.Router();

recipeRouter.get("/", authenticate, ctrl.getRecipes);
recipeRouter.get("/:category", authenticate, ctrl.getRecipesByCategory);
recipeRouter.get("/:ingredientId", authenticate, ctrl.getRecipesByIngredient);
recipeRouter.post(
  "/",
  validateBody(schemas.addSchema),
  authenticate,
  ctrl.addRecipe
);
recipeRouter.delete("/:recipeId", authenticate, ctrl.deleteRecipeById);
