import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        issuer: String,

        date: Date,

        Certificate_Image: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }

        },

        link: String,

        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);