import mongoose from "mongoose";


// lets make it standardised

// const connectMongoDB = () =>{
//     const connect = mongoose.connect(process.env.MONGO_URI)
//     console.log("mongodb connected")
// }

const connectMongoDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to mongoDB: ${connect.connection.host}`)

    } catch (error) {
        console.log(`error to connecting to the database: ${error.message} `);
        process.exit(1);
    }
}

export default connectMongoDB;