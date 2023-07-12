import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { User } from "../models/user.js";

const getCurrent = async (req, res) => {
  res.json(req.user);
};

const changeName = async (req, res) => {
  const { _id, name } = req.user;

  if (name === req.body.name) {
    throw HttpError(409, "New name is the same as the old one");
  }

  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

  res.status(201).json(user);
};

const changeAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) throw HttpError(400, "Image is required");

  const user = await User.findByIdAndUpdate(_id, { avatar: req.file.path }, { new: true });

  res.status(200).json(user);
};

const changeTheme = async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.para;

  const user = await User.findByIdAndUpdate(_id, { theme }, { new: true });

  res.status(200).json(user);
};

export const ctrl = {
  getCurrent: ctrlWrapper(getCurrent),
  changeName: ctrlWrapper(changeName),
  changeAvatar: ctrlWrapper(changeAvatar),
  changeTheme: ctrlWrapper(changeTheme),
};
