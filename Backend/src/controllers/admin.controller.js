import { asyncHandler } from "../utilis/asyncHandeller.js";
import { ApiError } from "../utilis/apiError.js";
import { ApiResponse } from "../utilis/apiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
};



const generatingAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (err) {
        console.log(err);
        throw new ApiError(500, "Something went wrong while generating access and refresh token")

    }
}






// add a user .
const addUser = asyncHandler(async(req, res) => {

    const { fullname, email, password } = req.body;

    if(!fullname || !email || !password) {
        throw new ApiError(401, "Filled all details")
    }

    const alreadyExsits = await User.findOne({
        email: email
    })

    if(alreadyExsits){
        throw new ApiError(401, "The user already exsits");
    }

    const newUser = await User.create({
        fullname,
        email,
        password
    })
    
    if(!newUser){
        throw new ApiError(404, "Error, while creating the user")
    }

    return res.status(200)
    .json(new ApiResponse(200, 
        {},
        "User register successfully"
    ))

})




//logIn

const logIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //checking for all fileds are filled
    if(!email || !password){
        throw new ApiError(400, "All fields are required")

    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const passwordValid = await user.isPasswordCorrect(password);

    if (!passwordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }


    const {accessToken, refreshToken} = await generatingAccessTokenAndRefreshToken(user._id)

    const logInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, logInUser, "User Logged in successfully"))


})




//logout 

const logOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: { refreshToken : 1}
        },
        {
            new: true
        }

    )

    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out successfully"))
})








//Access a new refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )


        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken: newRefreshToken } = await generatingAccessTokenAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            )
    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid refresh token")
    }
})






export 
{

    addUser,
    logIn,
    logOut,
    refreshAccessToken

}