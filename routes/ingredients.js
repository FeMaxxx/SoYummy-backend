import express from "express";

import { authenticate } from "../middlewares/index.js";
import { ctrl } from "../controllers/ingredients.js";

export const ingredientRouter = express.Router();

ingredientRouter.get("/", authenticate, ctrl.getIngredients);
ingredientRouter.get("/:ingredient", authenticate, ctrl.getIngredientsByName);
