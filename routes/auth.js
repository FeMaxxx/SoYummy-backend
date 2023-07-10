import express from "express";
import { ctrl } from "../controllers/auth.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/user.js";
import { authenticate } from "../middlewares/index.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), ctrl.register);

authRouter.post("/login", validateBody(schemas.loginSchema), ctrl.login);

authRouter.post("/logout", authenticate, ctrl.logout);
