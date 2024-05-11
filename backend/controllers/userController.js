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

        if (id===req.user._id) {
            return res.status(100).json({
                error:"You can't follow/unfollow yourself"
            })
            
        }if (!userToModify|| !currentUser) return res.status(400).json({error:"User not found"});

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //follow
            
        } else {
            //unfollow
        }
    } catch (error) {
        console.log("Error in followUnfollow ", error.message)
        res.status(500).json({error: error.message })
    }
}