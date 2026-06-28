import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
    {
        institution: {
            type: String,
            required: true
        },

        degree: {
            type: String,
            required: true
        },

        field: String,

        startYear: Number,
        endYear: Number,

        description: String,

        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);