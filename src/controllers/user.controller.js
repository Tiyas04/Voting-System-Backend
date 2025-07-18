import { User } from "../models/user.model.js"
import ApiError from "../utils/apierror.js"
import asyncHandler from "../utils/asynchandler.js"
import ApiResponse from "../utils/apiresponse.js"

const generateAccessandRefreshToken = async (Id) => {
    try {
        const existingUser = await User.findById(Id)

        const accessToken = existingUser.GenerateAccessToken()
        const refreshToken = existingUser.GenerateRefreshToken()
        await existingUser.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { FullName, Email, UserName, Role, Password } = req.body

    if ([FullName, Email, UserName, Role, Password].some((field) => { !field || field.trim() === "" })) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ Email }, { UserName }]
    })
    if (existingUser) {
        throw new ApiError(400, "User already exists with this email or username")
    }
    if (Password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long")
    }

    User.create({
        FullName,
        Email: Email.toLowerCase(),
        UserName,
        Role,
        Password
    }).then((user) => {
        const { Password, RefreshToken, _id, __v, ...userData } = user._doc;

        console.log("User registered successfully", userData);

        res.status(201).json(
            new ApiResponse(201, userData, "User registered successfully")
        )
    }).catch((error) => {
        throw new ApiError(500, error.message || "Internal Server Error")
    })
})

const loginUser = asyncHandler(async (req, res) => {
    const { UserName, Password } = req.body

    if ([UserName, Password].some((field) => { !field || field.trim() === "" })) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ UserName })
    if (!existingUser) {
        throw new ApiError(404, "No user found")
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(Password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(existingUser._id)

    const loggedinUser = await User.findById(existingUser._id).select("-Password -_id -__v -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.User._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, {}, "User Logged Out successfully"
            )
        )
})


export { registerUser, loginUser, logoutUser }
