import { Profile } from "../models/personalInfo.models.js"
import { ApiError } from "../utilis/apiError.js"
import { ApiResponse } from "../utilis/apiResponse.js"
import { asyncHandler } from "../utilis/asyncHandeller.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utilis/cloudinary.js"



//add profile details
const createProfile = asyncHandler(async (req, res) => {
    const { fullname, title, about, email, phone, location } = req.body

    const alreadyExists = await Profile.findOne({ email })

    if (alreadyExists) {
        throw new ApiError(401, "User information already exists")
    }


    //upload the profile_image.

    console.log("FILES:", req.files);
    console.log("PROFILE PATH:", req.files?.profileImage?.[0]?.path);

    let profileImage = null;

    const profileImage_Path = req.files?.profileImage?.[0]?.path;

    console.log(profileImage_Path);

    if (profileImage_Path) {
        const uploadedImage = await uploadOnCloudinary(profileImage_Path)

        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload profile image");
        }


        profileImage = {
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id
        }

    }



    //upload the resume.

    let resume = null;

    const resume_path = req.files?.resume?.[0]?.path;

    if (resume_path) {
        const uploadedResume = await uploadOnCloudinary(resume_path)

        if (!uploadedResume) {
            throw new ApiError(500, "Failed to upload resume");

        }

        resume = {
            url: uploadedResume.secure_url,
            public_id: uploadedResume.public_id
        }
    }


    const profile = await Profile.create({
        fullname,
        title,
        about,
        email,
        phone,
        location,
        profileImage,
        resume
    })

    const createdProfile = await Profile.findById(profile._id);

    if (!createdProfile) {
        throw new ApiError(500, "Failed to create profile")

    }


    return res.status(200)
        .json(new ApiResponse(
            200,
            createdProfile,
            "Successfully created profile"
        ))



})



//get profile
const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne();

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile fetched successfully"
        )
    );
});




//update profile details
const updateProfileInformation = asyncHandler(async (req, res) => {
    const { fullname, email, about, title, phone, location } = req.body;


    const profile = await Profile.findOne()

    if (!profile) {
        throw new ApiError(404, "profile not found")
    }

    profile.fullname = fullname || profile.fullname;
    profile.title = title || profile.title;
    profile.about = about || profile.about;
    profile.email = email || profile.email;
    profile.phone = phone || profile.phone;
    profile.location = location || profile.location;


    await profile.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile updated successfully"
        )
    );
})



//update profile_image
const update_Profile_image = asyncHandler(async (req, res) => {

    const profileImage_Path = req.file?.path;

    if (!profileImage_Path) {
        throw new ApiError(400, "Profile image is required");
    }

    const profile = await Profile.findOne();

    if (!profile) {
        throw new ApiError(404, "Profile not found")
    }

    if (profile.profileImage?.public_id) {
        await deleteFromCloudinary(profile.profileImage.public_id)
    }

    const uploadImage = await uploadOnCloudinary(profileImage_Path);

    if (!uploadImage) {
        throw new ApiError(500, "Failed to upload profile image");
    }

    profile.profileImage = {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id
    }

    await profile.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile image updated successfully"
        )
    );


})




//update resume 
const update_resume = asyncHandler(async (req, res) => {

    const resume_path = req.file?.path;

    if (!resume_path) {
        throw new ApiError(400, "Resume is required");
    }

    const profile = await Profile.findOne();

    if (!profile) {
        throw new ApiError(404, "Profile not found")
    }

    if (profile.resume?.public_id) {
        await deleteFromCloudinary(profile.resume.public_id)
    }

    const uploadResume = await uploadOnCloudinary(resume_path);

    if (!uploadResume) {
        throw new ApiError(500, "Failed to upload resume");
    }

    profile.resume = {
        url: uploadResume.secure_url,
        public_id: uploadResume.public_id
    }

    await profile.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Resume updated successfully"
        )
    );


})








export {
    createProfile,
    getProfile,
    updateProfileInformation,
    update_Profile_image,
    update_resume
}