import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        fullname: String,
        title: String,
        about: String,
        email: String,
        phone: String,
        location: String,

        profileImage: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }

        },


        resume: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }

        },
    },
    { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);