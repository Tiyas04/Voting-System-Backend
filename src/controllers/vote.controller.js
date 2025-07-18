import { Vote } from "../models/vote.model.js";
import { Election } from "../models/election.model.js";
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";

const castVote = asyncHandler(async (req, res) => {
    const { electionId, candidateId } = req.body;
    const voterId = req.User._id;

    const election = await Election.findById(electionId);
    if (!election) {
        throw new ApiError(404, "Election not found");
    }

    if (election.status !== "Ongoing") {
        throw new ApiError(400, "Election is not active");
    }

    if (!election.candidates.includes(candidateId)) {
        throw new ApiError(400, "Candidate not part of this election");
    }

    const existingVote = await Vote.findOne({ voter: voterId, election: electionId });

    if (existingVote) {
        throw new ApiError(400, "You have already voted in this election");
    }

    const vote = await Vote.create({
        voter: voterId,
        election: electionId,
        candidate: candidateId
    })

    res
        .status(200)
        .json(
            new ApiResponse(200, vote, "Vote cast successfully")
        )
})

const getElectionResults = asyncHandler(async (req, res) => {
    const { electionId } = req.params;

    const userRole = req.User.Role;

    const election = await Election.findById(electionId)

    if (!election) {
        throw new ApiError(404, "Election not found");
    }

    if (election.status !== "Ended" && userRole !== "Admin") {
        throw new ApiError(400, "Election results are not available yet");
    }


    const results = await Vote.aggregate([
        { $match: { election: new mongoose.Types.ObjectId(electionId) } },
        {
            $group: {
                _id: "$candidate",
                votes: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "candidateDetails"
            }
        },
        { $unwind: "$candidateDetails" },
        {
            $project: {
                candidateId: "$candidateDetails._id",
                name: "$candidateDetails.FullName",
                votes: 1
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(200, results, "Election results fetched successfully")
    )
})

export { castVote, getElectionResults };