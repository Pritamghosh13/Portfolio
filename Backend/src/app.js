import express from "express"
import adminRouter from "./routes/admin.routes.js"
import profileRouter from "./routes/profile_info.routes.js"
import cookieParser from "cookie-parser"
import certificateRouter from "./routes/certificate.routes.js"


const app = express()


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




app.use("/api/v1" , adminRouter)


app.use("/api/v1" , profileRouter)


app.use("/api/v1" , certificateRouter)








export {app}