import express from "express";
import { ctrl } from "../controllers/favorite.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/favorite.js";

export const favoriteRouter = express.Router();

favoriteRouter.post("/add", validateBody(schemas.addSchema), ctrl.add);

favoriteRouter.get("/get", ctrl.get);

favoriteRouter.post("/remove", validateBody(schemas.removeSchema), ctrl.remove);
