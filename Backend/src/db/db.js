import mongoose, { connections } from "mongoose"
import dotenv from "dotenv"
import { DB_name } from "../constants.js"

dotenv.config({
    path: "./.env"
})



const connectDB = async () => {
    try {
        // console.log(process.env.mongodb_url);
        
        const connectionString = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`)

        console.log(`\nMongoDB connected successfully , DB Host : ${connectionString.connection.host}`);
        
    } catch (error) {
        console.log(error, "Mongodb connection failed");
        process.exit(1);
    }
}


export {connectDB}