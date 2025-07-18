import mongoose from "mongoose";
import db from "../constant.js";

const connectDB = async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${db}`)
    }catch(error){
        console.log("Error:",error)
    }
}

export default connectDB