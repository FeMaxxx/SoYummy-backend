import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const changeName = async (req, res) => {
  const { _id, name } = req.user;

  if (name === req.body.name) {
    throw HttpError(409, "New name is the same as the old one");
  }

  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

  res.status(201).json(user);
};

const getCurrent = async (req, res) => {
  res.json(req.user);
};

export const ctrl = {
  changeName: ctrlWrapper(changeName),
  getCurrent: ctrlWrapper(getCurrent),
};
