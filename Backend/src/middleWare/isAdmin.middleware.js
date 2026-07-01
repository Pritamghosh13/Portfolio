import { asyncHandler } from "../utilis/asyncHandeller.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utilis/apiError.js";


const isAdmin = asyncHandler( async (req, res, next) => {
    const user = req.user;

    if(!user){
        throw new ApiError(404, "user not found while checking is user admin or not")
    }

    if(user.role !== "admin"){
        throw new ApiError(403 , "User not an admin")
    }

    next()
})


export {
    isAdmin
}