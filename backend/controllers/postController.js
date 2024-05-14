import Post from "../models/post.model.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

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

