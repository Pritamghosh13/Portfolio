import { app } from "./app.js";
import dotenv from "dotenv"


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
