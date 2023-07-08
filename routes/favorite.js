import express from "express";
import { ctrl } from "../controllers/auth.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/favorite.js";

export const faviriteRouter = express.Router();

faviriteRouter.post("/add", validateBody(schemas.addSchema), ctrl.register);

faviriteRouter.get("/get", ctrl.getCurrent);

faviriteRouter.post("/remove", validateBody(schemas.removeSchema), ctrl.login);
