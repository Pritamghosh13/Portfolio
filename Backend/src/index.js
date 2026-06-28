import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/db.js";


dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT  || 8000;

// app.get("/", (req, res) => {
//     res.send("Hellloo")
// })


// app.listen(PORT, () => {
//     console.log(`The server is running on port ${PORT}`);
    
// })



connectDB()
.then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`The server is running on port : ${PORT}`);
            
        })

        app.on("error", (error) => {

            console.log(error, "Error in server, after connecting the server");
            
        })
    } catch (error) {
        console.log(error, "ERROR: While connecting the server.");
        
    }
})



