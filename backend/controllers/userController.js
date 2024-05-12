import Notification from "../models/notifiation.model.js";
import User from "../models/userModel.js";

export const getUserProfile = async(req,res)=>{
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({message:"User not found"});
        }
        res.status(201).json(user);
    } catch (error) {
        console.log("Error in getUserprofile ", error.message)
        res.status(500).json({error: error.message })
        
    }
}

export const followUnfollow = async(req, res)=>{
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser= await User.findById(req.user._id);

        if (id===req.user._id.toString()) {
            return res.status(400).json({
                error:"You can't follow/unfollow yourself"
            })
            
        }if (!userToModify|| !currentUser) return res.status(400).json({error:"User not found"});

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //follow
            await User.findByIdAndUpdate(id, { $pull:{ followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{$pull:{following: id}});
            //TODO: return the id of the user as a response
            res.status(200).json({ message: "User Unfollowed sucessfully"});
        } else {
            //unfollow
            await User.findByIdAndUpdate(id, { $push:{ followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{$push:{following: id}});
            //send notification
            const newNotification = new Notification({
                type:"follow",
                from: req.user._id,
                to: userToModify._id,
            })

            await newNotification.save();
            //TODO: return the id of the user as a response
            res.status(200).json({ message: "User followed sucessfully"});
        }
    } catch (error) {
        console.log("Error in followUnfollow ", error.message)
        res.status(500).json({error: error.message })
    }
}

export const getSuggestedUsers = async(req, res)=>{
    try {
        const userId = req.user._id;

        const userFollowedByMe = await User.findById(userId).select("followiing");

        const users =  await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId},
                }
            },
            {$sample:{size:10}}
        ])
        const filteredUser = users.filter(user=>!userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUser.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("error in suggested User", error.message)
        res.status(500).json({error: error.message})
        
    }
}