import { Election } from "../models/election.model.js";
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import { CandidateApplication } from "../models/candidateapplication.model.js";

const createElection = asyncHandler(async (req, res) => {
    const { Title, Description, StartDate, EndDate, Candidates } = req.body;

    if ([Title, Description, StartDate, EndDate].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    await Election.create({
        Title,
        Description,
        StartDate,
        EndDate,
        Candidates,
        CreatedBy: req.User._id
    }).then((election) => {
        const { __v, CreatedBy, _id, ...electionData } = election._doc;

        res.status(201).json(
            new ApiResponse(201, electionData, "Election created successfully")
        );
    }).catch((error) => {
        throw new ApiError(500, error.message || "Internal server error");
    });
});

const getAllElections = asyncHandler(async (req, res) => {
    const elections = await Election.find().populate("Candidates", "FullName UserName Role");
    res.status(200).json(
        new ApiResponse(200, elections, "Elections fetched successfully")
    );
});

const deleteElection = asyncHandler(async (req, res) => {
    const electionId = req.params.id;
    if (!electionId) {
        throw new ApiError(400, "Election ID is required");
    }
    const election = await Election.findByIdAndDelete(electionId);
    if (!election) {
        throw new ApiError(404, "Election not found");
    }
});

const removeCandidatefromElection = asyncHandler(async (req, res) => {
    const { electionId, candidateId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
        return res.status(404).json({ message: "Election not found" });
    }

    const index = election.candidates.indexOf(candidateId);
    if (index === -1) {
        return res.status(400).json(
            new ApiResponse(400, null, "Candidate not part of this election")
        );
    }

    election.candidates.splice(index, 1);
    await election.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, null, "Candidate removed from election successfully")
    );
})

const updateElectionStatus = asyncHandler(async (req, res) => {
    const { electionId } = req.params;
    const { status } = req.body;

    const allowed = ["Upcoming", "Ongoing", "Ended"];

    if (!allowed.includes(status)) {
        throw new ApiError(400, `Invalid status. Allowed values are: ${allowed.join(", ")}`);
    }

    const election = await Election.findByIdAndUpdate(electionId, { status }, { new: true });

    res
        .status(200)
        .json(
            new ApiResponse(200, election, "Election status updated successfully")
        );
})

export { createElection, getAllElections, deleteElection, removeCandidatefromElection, updateElectionStatus };