import express from "express";
import { ctrl } from "../controllers/favorite.js";

export const favoriteRouter = express.Router();

favoriteRouter.post("/:recipeId", ctrl.add);

favoriteRouter.get("/", ctrl.get);

favoriteRouter.delete("/:recipeId", ctrl.remove);
