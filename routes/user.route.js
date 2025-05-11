import express from "express";
import { getUserProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

//yha pe post(register) use kiye hai kyuki ye register logic ko post krega jo ki user ko register kr dega
router.route("/register").post(register);

//same for login
router.route("/login").post(login);

//logout krne ka route
router.route("/logout").get(logout);

//ye getUserProfile function ka route hai(usko call kiya gya hai)
//par yha pe pehle isAuthenticated true hoga to hi getUserProfile function call hoga , next() ke help se
router.route("/profile").get(isAuthenticated, getUserProfile);

//profile update krne ka route + multer ka upload.single("profilePhoto") use kiya hai
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile);

export default router;
