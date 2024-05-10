import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


 export const protectRoute = async (req, res, next) =>{
    try {

       
        const token = req.cookies.jwt;

        
        if(!token){
            return res.status(401).json({error:"Unauthorized : No Token provided"});
        }

       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        if (!decoded) {
            return res.status(404).json({error:"Unauthorized : Invalid Token"});
        }

        
        const user = await User.findById(decoded.userId).select("-password");

        
        if (!user) {
            return res.status(405).json({error:"User not found"});
        }


        req.user = user;
        next();


    } catch (error) {
        console.log("Error in protectRoute middle ware", error.message);
        return res.status(500).json({
            error:"Internal server error",
        })
    }
 }