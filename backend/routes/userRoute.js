import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

import {
  getCurrentUser,
  UpdateProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controllers/userController.js";

import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

const userRouter = express.Router();

// ✅ Get logged-in user data
userRouter.get("/currentuser", isAuth, getCurrentUser);

// ✅ Update profile + image upload
userRouter.post(
  "/updateprofile",
  isAuth,
  upload.single("photoUrl"),
  UpdateProfile
);

// ✅ Wishlist
userRouter.post("/addtowishlist", isAuth, addToWishlist);
userRouter.post("/removefromwishlist", isAuth, removeFromWishlist);
userRouter.get("/wishlist", isAuth, getWishlist);

// ✅ Notifications
userRouter.get("/notifications", isAuth, getNotifications);
userRouter.post("/notifications/:id/read", isAuth, markAsRead);

export default userRouter;
