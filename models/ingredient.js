import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
    },
    description: {
      type: String,
    },
    img: {
      type: String,
      default: "Ingredient image",
    },
  },
  { versionKey: false, timestamps: false }
);

ingredientSchema.post("save", handleMongooseError);

export const Ingredient = model("ingredient", ingredientSchema);
