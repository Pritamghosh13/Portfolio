import { Router } from "express";
import { addUser, logIn, logOut, refreshAccessToken } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleWare/auth.middleware.js";





const router = Router()



router.route("/add").post(addUser)

router.route("/login").post(logIn)

router.route("/logout").post(verifyJWT, logOut)

router.route("refresh").post(refreshAccessToken)








export default router