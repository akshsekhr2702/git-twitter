import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollow } from "../controllers/userController.js";


const router = express.Router();

router.get("/profile/:username",protectRoute, getUserProfile);
// router.get("/suggested", protectRoute,getUserProfile);
router.post("/follow/:id", protectRoute,followUnfollow);
// router.post("/suggested", protectRoute ,updateUserProfile);

export default router;