import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import "./scheduler/electionscheduler.js";

 dotenv.config({
    path:"/.env"
 })

 connectDB()
 .then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("App launch successful")
    })
 }).catch((error)=>{
    console.log("Error:",error)
 })