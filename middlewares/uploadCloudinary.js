import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const recipeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const { _id } = req.user;

    return {
      folder: "recipes",
      allowed_formats: ["jpg", "png", "webp"],
      public_id: `${_id}_${file.originalname}`,
      transformation: [{ width: 700, height: 700 }],
    };
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { _id } = req.user;

    return {
      folder: "avatars",
      allowed_formats: ["jpg", "png", "webp"],
      public_id: `${_id}_${file.originalname}`,
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    };
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadRecipe = multer({ storage: recipeStorage });
