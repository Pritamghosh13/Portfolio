import { Router } from "express";
import { createProfile, getProfile, update_Profile_image, update_resume, updateProfileInformation } from "../controllers/personalInfo.controller.js";
import { verifyJWT } from "../middleWare/auth.middleware.js";
import { isAdmin } from "../middleWare/isAdmin.middleware.js";
import { upload } from "../middleWare/multer.middleware.js";

const router = Router()




router.route("/profile/create").post(verifyJWT, isAdmin,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]),
    createProfile
)


router.route("/profile/get").get(getProfile)

router.route("/profile/update").patch(verifyJWT, isAdmin, updateProfileInformation)


router.route("/profile/image/update").patch(verifyJWT, isAdmin, upload.single("profileImage") ,update_Profile_image)

router.route("/profile/resume/update").patch(verifyJWT, isAdmin, upload.single("resume") ,update_resume)







export default router