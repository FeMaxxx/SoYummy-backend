import express from "express";
import { authenticate } from "../middlewares/index.js";
import { ctrl } from "../controllers/recipes.js";

export const categoryRouter = express.Router();

categoryRouter.get("/", authenticate, ctrl.getCategoryList);
