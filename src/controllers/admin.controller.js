import { CandidateApplication } from "../models/candidateapplication.model.js";
import { Election } from "../models/election.model.js";
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";

const reviewApplication = asyncHandler(async (req, res) => {
    const { appId } = req.params;
    const { status } = req.body;

    const application = await CandidateApplication.findById(appId).populate("User", "FullName UserName").populate("Election");

    if(!application) {
        throw new ApiError(404, "Application not found");
    }

    if (status === "Approved") {
            const election = await Election.findById(application.Election._id);
            election.Candidates.push(application.User._id);
            await election.save({ validateBeforeSave: false });
        }

    application.status = status;
    await application.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, application, "Application reviewed successfully")
    );
})

const removeCandidatefromElection = asyncHandler(async (req, res,next) => {
    const { electionId, candidateId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
        throw new ApiError(404, "Election not found");
    }

    const index = election.Candidates.indexOf(candidateId);
        if (index === -1) {
            return res.status(400).json({ message: "Candidate not part of this election" });
        }

    election.Candidates.splice(index, 1);
    await election.save({validateBeforeSave: false});

    res.status(200).json(
        new ApiResponse(200, null, "Candidate removed from election successfully")
    );
    next();
})

export { reviewApplication, removeCandidatefromElection };