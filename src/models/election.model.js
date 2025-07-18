import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        trim: true,
    },
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    StartDate: {
        type: Date,
        required: true
    },
    EndDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Ended"],
        default: "Upcoming"
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export const Election = mongoose.model("Election", ElectionSchema);