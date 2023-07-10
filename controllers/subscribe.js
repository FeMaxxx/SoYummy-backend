import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { sendEmail } from "../services/index.js";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const { BASE_URL } = process.env;

const subscribe = async (req, res) => {
  const { email } = req.body;
  const { _id, email: userEmail, subscribe } = req.user;

  if (subscribe === true) {
    throw HttpError(409, "Uzer has already subscribed to the newsletter");
  }

  if (email === userEmail) {
    const varifyEmail = {
      to: email,
      subject: "So Yummy",
      html: `<h3>You have subscribed to the So Yummy newsletter<h3/>`,
    };
    await sendEmail(varifyEmail);
    await User.findByIdAndUpdate(_id, { subscribe: true });

    res.status(200).json("Successful subscription");
  } else {
    const varifyEmail = {
      to: email,
      subject: "So Yummy",
      html: `
              <h3>If you would like to subscribe to our newsletter, click on the "Subscribe" button<h3/>
              <a target="_blank" href="${BASE_URL}/api/subscribe/confirm/${_id}">Subscribe</a>
            `,
    };
    await sendEmail(varifyEmail);

    res.status(200).json("A subscription confirmation email has been sent");
  }
};

const confirmSubscribe = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  await User.findByIdAndUpdate(userId, { subscribe: true });

  res.status(200).json("Successful subscription");
};

export const ctrl = {
  subscribe: ctrlWrapper(subscribe),
  confirmSubscribe: ctrlWrapper(confirmSubscribe),
};
