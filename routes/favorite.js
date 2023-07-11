import express from "express";
import { ctrl } from "../controllers/favorite.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/favorite.js";

export const favoriteRouter = express.Router();

favoriteRouter.post("/", validateBody(schemas.addSchema), ctrl.add);

favoriteRouter.get("/", ctrl.get);

favoriteRouter.delete("/", validateBody(schemas.removeSchema), ctrl.remove);
