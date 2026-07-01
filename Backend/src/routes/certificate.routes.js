import { Router } from "express";
import { verifyJWT } from "../middleWare/auth.middleware.js";
import { isAdmin } from "../middleWare/isAdmin.middleware.js";
import { upload } from "../middleWare/multer.middleware.js";
import { addCertificate, deleteCertificate, getAllCertificates, getCertificateById } from "../controllers/certificate.controller.js";




const router = Router()




router.route("/certificate/add").post(verifyJWT, isAdmin, upload.single("Certificate_Image"), addCertificate)

router.route("/certificate/get").get(getAllCertificates)

router.route("/certificate/get/:id").get(getCertificateById)

router.route("/certificate/delete/:id").delete(deleteCertificate)




export default router;