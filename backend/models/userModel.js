import mongoose from "mongoose";

//creating schema

const userSchema = new mongoose.Schema({
    //username
    username:{
        type:String,
        required: true,
        unique: true,
    },
    fullname:{
        type:String,
        required: true,
        
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
   email:{
        type:String,
        required:true,
        unique:true,
    },
    followers:[
        {
            //every follower user is going to have a unqiue object id
            type:mongoose.Schema.Types.ObjectId,//16 character
            ref:"User",
            default:[]

        }
    ],
    following:[
        {
            //every following user is going to have a unqiue object id
            type:mongoose.Schema.Types.ObjectId,//16 character
            ref:"User",
            default:[]

        }
    ],
    profileImg:{
        type:String,
        default:"",

    },
    coverImg:{
        type:String,
        default:"",

    },
    bio:{
        type:String,
        default:"",

    },
},{timestamps:true })

//creating model

const User = mongoose.model("User", userSchema);

export default User; 