import mongoose from "mongoose";

const CandidateApplicationSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false
    },
    Election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    Manifesto: {
        type: String
    },
    TagLine: {
        type: String
    }
}, { timestamps: true });

export const CandidateApplication = mongoose.model("CandidateApplication", CandidateApplicationSchema);
