import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoose.js";


//this is used to call out the elements or variables stored in dotenv file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//this is going to be the ewgular function which runs between req and resposne
app.use(express.json()); //to parse req.body
//to parse form data url encoded
app.use(express.urlencoded({extended: true}));

//this is used to create a middle ware app.use
app.use("/api/auth", authRoutes);




//process.env.MONGO_URI this thing displays the mongo uri what we wrote in the dotenv file
console.log(process.env.MONGO_URI);



// is basically used to listen whatever is present in 8000 ok??
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectMongoDB();
})