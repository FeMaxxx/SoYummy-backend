import express from "express";
import { ctrl } from "../controllers/main-page.js";

export const mainPageRouter = express.Router();

mainPageRouter.get("/", ctrl.getRecipesByCategories);
