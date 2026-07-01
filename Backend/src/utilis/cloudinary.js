import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./apiError.js"
import dotenv from "dotenv"


dotenv.config()




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})





const uploadOnCloudinary = async (localFilePath) => {

    
    try {

        if(!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log(response);
        

        fs.unlinkSync(localFilePath) 

        console.log("File is uploaded on cloudniary", response.secure_url);

        return response
        
    } catch (error) {

        fs.unlinkSync(localFilePath) //remove the locally save temporary file
        console.log(error);
        return null;
        
        
    }
}



const deleteFromCloudinary = async(id) => {
    if(!id){
        throw new ApiError(400, "Id is Invalid")
    }

    await cloudinary.uploader.destroy(id);

    return ;
}


export {
    deleteFromCloudinary,
    uploadOnCloudinary
}


