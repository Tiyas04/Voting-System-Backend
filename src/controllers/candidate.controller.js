import { Election } from "../models/election.model.js";
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import { CandidateApplication } from "../models/candidateapplication.model.js";

const ApplyAsCandidate = asyncHandler(async (req, res) => {
    const {electionId} = req.params;
    const {Manifesto, TagLine} = req.body;
    const userId = req.User._id;

    const election = await Election.findById(electionId);
    if (!election) {
        throw new ApiError(404, "Election not found");
    }

    const existingApplication = await CandidateApplication.findOne({ 
        User: userId,
        Election: electionId
    })

    if (existingApplication) {
        throw new ApiError(400, "You have already applied for this election");
    }

    const application = await CandidateApplication.create({
        User: userId,
        Election: electionId,
        Manifesto,
        TagLine
    })

    res
    .status(200)
    .json(
        new ApiResponse(200, application, "Application submitted successfully")
    )
})

export { ApplyAsCandidate }