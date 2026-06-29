import { Router } from "express";
import { addUser, logIn } from "../controllers/admin.controller.js";





const router = Router()



router.route("/add").post(addUser)

router.route("/login").post(logIn)








export default router