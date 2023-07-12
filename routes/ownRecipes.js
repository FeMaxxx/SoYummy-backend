import express from "express";
import { ctrl } from "../controllers/ownRecipes.js";

export const ownRecipesRouter = express.Router();

ownRecipesRouter.get("/", ctrl.get);
