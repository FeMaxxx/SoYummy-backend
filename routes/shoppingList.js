import express from "express";
import { ctrl } from "../controllers/shoppingList.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/shoppingList.js";

export const shoppingListRouter = express.Router();

shoppingListRouter.post("/", validateBody(schemas.addSchema), ctrl.add);

shoppingListRouter.delete("/", validateBody(schemas.removeSchema), ctrl.remove);
