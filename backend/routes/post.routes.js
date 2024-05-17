import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPost, likeUnlikePost } from "../controllers/postController.js";

const router = express.Router();


router.get('/all', protectRoute, getAllPost )

router.post('/create', protectRoute, createPost)
router.post('/like/:id', protectRoute, likeUnlikePost)
router.post('/comment/:id', protectRoute, commentOnPost);
router.delete('/:id', protectRoute, deletePost)


export default router;
