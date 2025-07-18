import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asynchandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = await req.cookies?.accessToken

    if (!token) {
        throw new ApiError(402, "No active session found")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const existingUser = await User.findById(decodedToken._id)

    if (!existingUser) {
        throw new ApiError(402, "No active session found")
    }

    req.User = existingUser
    if(!req.User) {
        throw new ApiError(401, "Unauthorized: User not found");
    }
    next()
})

const authorizeRoles = (...roles) => {
    try {
        return (req, res, next) => {
            if (!roles.includes(req.User.Role)) {
                throw new ApiError(403, `Role: ${req.User.Role} is not allowed to access this resource`);
            }
            next();
        };
    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
};

export { verifyJWT, authorizeRoles };