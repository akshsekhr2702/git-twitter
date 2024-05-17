import Post from "../models/post.model.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notifiation.model.js"

export const createPost = async(req, res)=>{
    try {
        const { text} = req.body;
        let {img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if(!user){
           return res.status(404).json({
                message:"User not found"
            })
        }
        if(!text && !img){
            return res.status(401).json({
                message: "Post must have text or img",
            })
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user:userId,
            text,
            img,
        })

        await newPost.save();

        res.status(201).json(newPost)

    } catch (error) {
        console.log("error in create post controller:",error.message);
        res.status(500).json({
            error:error.message,
        })
    }
}

export const deletePost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(401).json({
                error: "Post not found",
            })

        }
        if(post.user.toString()!== req.user._id.toString()){
            return res.status(400).json({
                error:"You are not authorzied to delete the post"
            })
        }

        if(post.img){
            const imgId = post.img.split("/").pop.split(".")[0];
            await cloudinary.uploader.destroy(imgId);

        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"Post deleted sucessfully",
        })
    } catch (error) {
        console.log("error: ", error.message);
        res.status(404).json({
            error: "Internal Server Error"
        })
    }
}

export const commentOnPost = async(req, res)=>{
    try {
        const {text}= req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(201).json({
                error:"Text feild is required",
            })
        }
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error:"post not found"
            })
        }

        const comment = {user: userId, text}

        post.comments.push(comment);

        await post.save();

        res.status(202).json(post)
    } catch (error) {
        console.log("error in commentOnPOst controller", error.message)
        res.status(500).json({
            error: error.message
        })
    }
}

export const likeUnlikePost = async(req, res)=>{
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                error:"post not found"
            })
        }
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //Unlike post
            await Post.updateOne({_id:postId}, {$pull: {likes:userId}})
            await User.updateOne({_id:postId},{$pull:{likedPost:postId}})
            res.status(200).json({
                message:"Post unliked sucessfully...."
            })
        }else{
            post.likes.push(userId);
            await User.updateOne({_id:userId}, {$push:{likedPost:postId}})
            await post.save();
            const notification = new Notification({
                from: userId,
                to: post.user,
                type:"like"
            })


            await notification.save();

            res.status(200).json({
                message:'Post liked Sucessfully',
            })
        }


        
    } catch (error) {
        console.log("Error in postlike controller ", error.message)
        res.status(404).json({
            error:error.message,
        });
    }
}

export const getAllPost = async(req, res)=>{
try {
    const posts = await Post.find().sort({ createdAt: -1}).populate({
        path: "user",
        select:"-password",
    })
    .populate({
        path:"comments.user",
        select:"-password"
    })
    if(posts.length===0){
        return res.status(200).json([])
    }
    res.status(200).json(posts)
} catch (error) {
    console.log("Error in getALlPOst controller:", error.message);
    res.status(500).json({
        error:"Internal server error"
    })
}
}