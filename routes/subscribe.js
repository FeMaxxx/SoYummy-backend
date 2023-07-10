import express from "express";
import { ctrl } from "../controllers/subscribe.js";
import { validateBody } from "../middlewares/index.js";
import { schemas } from "../models/subscribe.js";
import { authenticate } from "../middlewares/index.js";

export const subscribeRouter = express.Router();

subscribeRouter.get("/", authenticate, validateBody(schemas.subscribeSchema), ctrl.subscribe);

subscribeRouter.get("/confirm/:userId", ctrl.confirmSubscribe);
