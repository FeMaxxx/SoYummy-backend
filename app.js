import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import { authenticate } from "./middlewares/index.js";

import { authRouter, ingredientRouter, recipeRouter } from "./routes/index.js";
import { favoriteRouter } from "./routes/favorite.js";
import { subscribeRouter } from "./routes/subscribe.js";
import { usersRouter } from "./routes/users.js";

dotenv.config();

export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", authenticate, usersRouter);
app.use("/api/favirite", authenticate, favoriteRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/recipes", authenticate, recipeRouter);
app.use("/api/ingredients", authenticate, ingredientRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});
