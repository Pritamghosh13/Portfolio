import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        technologies: [
            {
                type: String,
                trim: true
            }
        ],

        githubLink: {
            type: String
        },

        liveLink: {
            type: String
        },

        image: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }

        },

        featured: {
            type: Boolean,
            default: false
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

export const Project = mongoose.model("Project", projectSchema);