import mongoose from "mongoose";
import { ctrlWrapper } from "../helpers/index.js";
import { Category } from "../models/category.js";

const getCategoryList = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

export const ctrl = {
  getCategoryList: ctrlWrapper(getCategoryList),
};
