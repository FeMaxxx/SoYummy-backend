import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";
import { Ingredient } from "../models/ingredient.js";

const add = async (req, res) => {
  const { _id, shoppingList } = req.user;
  const { ingredient, recipeId } = req.body;

  const resultIngredient = await Ingredient.findById(ingredient._id);
  if (resultIngredient.length === 0) {
    throw HttpError(404, "Ingredient not found");
  }

  const ingredientsInShoppingList = shoppingList.some(
    el => el.recipeId === recipeId && el.ingredient._id === ingredient._id
  );
  if (ingredientsInShoppingList) {
    throw HttpError(409, "The ingredient already added to shopping list");
  }

  await User.findByIdAndUpdate(_id, { $push: { shoppingList: req.body } });

  res.status(201).json("Ingredient added to shopping list");
};

const remove = async (req, res) => {
  const { _id, shoppingList } = req.user;
  const { ingredient, recipeId } = req.body;
  const ingredientInShoppingList = shoppingList.find(
    el => el.ingredient._id.toString() === ingredient._id.toString() && el.recipeId === recipeId
  );

  if (!ingredientInShoppingList || ingredientInShoppingList.recipeId !== recipeId) {
    throw HttpError(404, "Ingredient not found");
  }

  await User.findByIdAndUpdate(_id, { $pull: { shoppingList: ingredientInShoppingList } });

  res.status(200).json("Ingredient deleted from shopping list");
};

export const ctrl = {
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
};
