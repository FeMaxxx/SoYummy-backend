import express from "express";
import { ctrl } from "../controllers/auth.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/favorite.js";

export const favoriteRouter = express.Router();

favoriteRouter.post("/add", validateBody(schemas.addSchema), ctrl.register);

favoriteRouter.get("/get", ctrl.getCurrent);

favoriteRouter.post("/remove", validateBody(schemas.removeSchema), ctrl.login);
