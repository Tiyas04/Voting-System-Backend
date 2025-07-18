import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    }
}, { timestamps: true });

VoteSchema.index({ voter: 1, election: 1 }, { unique: true }); 

export const Vote = mongoose.model("Vote", VoteSchema);