import jwt from "jsonwebtoken";
import { ApiError } from "../utilis/apiError.js";
import { asyncHandler } from "../utilis/asyncHandeller.js";
import { User } from "../models/user.models.js";
import dotenv from "dotenv"


dotenv.config({
    path: "./.env"
})



export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token")

        }

        req.user = user;

        next()
    } catch (error) {
        
        throw new ApiError(401, error?.message || "Invalid access token")

    }
})