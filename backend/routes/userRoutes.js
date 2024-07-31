import express from "express";
import {updateUser, followUnfollowUser, getUserProfile, loginUser, logoutUser, signUpUser, getSuggestedUsers, freezeAccount} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// router.get("/signup",(req,res)=>{
//     res.send("Signed up successfully!");
// });

// We use controllers here instead of writing the whole logic in here

router.get("/profile/:query",getUserProfile);
router.get("/suggested",protectRoute,getSuggestedUsers);
router.post("/signup",signUpUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser); // We are going to protect this route - for checking authentication
router.put("/update/:id", protectRoute, updateUser); // We are going to protect this route - for checking authentication
router.put("/freeze", protectRoute, freezeAccount); // We are going to protect this route - for checking authentication

// I cant follow someone if I am not logged in.


export default router;