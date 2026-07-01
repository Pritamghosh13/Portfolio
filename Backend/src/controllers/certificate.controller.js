import { Certificate } from "../models/certificate.models.js";
import { ApiError } from "../utilis/apiError.js";
import { ApiResponse } from "../utilis/apiResponse.js";
import { asyncHandler } from "../utilis/asyncHandeller.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js";
import { deleteFromCloudinary } from "../utilis/cloudinary.js";



//add a certificate
const addCertificate = asyncHandler(async (req, res) => {
    const { title, issuer, date, link, order } = req.body;

    if (!title || !issuer) {
        throw new ApiError(401, "Title, Issuer or Date are required")
    }


    let certificateImage = null;

    const certificate_path = req.file?.path;

    if (certificate_path) {
        const upload_certificate = await uploadOnCloudinary(certificate_path)

        if (!upload_certificate) {
            throw new ApiError(500, "Uploading certificate is failed")
        }

        certificateImage = {
            url: upload_certificate.secure_url,
            public_id: upload_certificate.public_id
        }

    }

    const certificate = await Certificate.create({
        title,
        issuer,
        date,
        Certificate_Image: certificateImage,
        link,
        order
    })

    const createdCertificate = await Certificate.findById(certificate._id)

    if (!createdCertificate) {
        throw new ApiError(400, "adding Certificate failed")
    }

    return res.status(201)
        .json(new ApiResponse(201, createdCertificate, "Crertificate added successfully"))
})


//get all certificate
const getAllCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find().sort({ order: 1, date: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, certificates, "All certificates fetched"));
});




//get single certificate
const getCertificateById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
        throw new ApiError(404, "Certificate not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, certificate, "Certificate fetched"));
});


//delete a certificate
const deleteCertificate = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
        throw new ApiError(404, "Certificate not found");
    }

    // delete image from cloudinary
    if (certificate.Certificate_Image?.public_id) {
        await deleteFromCloudinary(certificate.Certificate_Image.public_id);
    }

    await certificate.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Certificate deleted"));
});

export {
    addCertificate,
    getAllCertificates,
    getCertificateById,
    deleteCertificate
}