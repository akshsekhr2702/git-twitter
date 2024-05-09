import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res)=>{
   try {
    const {username, fullname, email, password} =req.body;
    //Email checking whether the email is valid or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({ error: "Invalid email format"});
    }
    //check whether the user already exist
    const existingUser = await User.findOne({ username});
    if(existingUser){
        return res.status(400).json({ error: "Username is already taken"});
    }
    //check whether the email already exist
    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({ error: "Email is already taken"});
    }
    //password validation
    if(password.length < 6){
        return res.status(400).json({ error : "password is short and it must be atleast 6 characters"})
    }
    //HASHING THE PASSWORD _ BCRYPTJS?

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
        //creating a new user
    const newUser = new User({
        fullname,
        username,email,
        password:hashedPassword,
    })
    if(newUser){
        //creating the token
        generateTokenAndSetCookie(newUser._id, res)
        //save the user details in database
        await newUser.save();


        //sending this resposne to the client
        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg
        })
    }else{
            res.status(400).json({ error: " invalid user data"});
    }

   } catch (error) {
    res.status(500).json({ error: "Internal server error"});
   }
}
export const login = async (req, res)=>{
    res.json({
        data:"You hit the login endpoint",
    });
}
export const logout = async (req, res)=>{
    res.json({
        data:"You hit the logout endpoint",
    });
}