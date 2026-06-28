import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Frontend",
                "Backend",
                "Database",
                "Tools",
                "DevOps",
                "AI",
                "ML"
            ],
            required: true
        },

        icon: {
            type: String
        },

        proficiency: {
            type: Number,
            min: 0,
            max: 100
        },

        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Skill = mongoose.model("Skill", skillSchema);