import express from "express";
import { ctrl } from "../controllers/users.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/user.js";

export const usersRouter = express.Router();

usersRouter.get("/current", ctrl.getCurrent);

usersRouter.patch("/changeName", validateBody(schemas.changeNameSchema), ctrl.changeName);