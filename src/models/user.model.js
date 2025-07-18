import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    Role: {
        type: String,
        required: true,
        enum: ["Admin", "Candidate", "Voter"]
    },
    Password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        this.Password = await bcrypt.hash(this.Password, 10)
        next()
    }
})

UserSchema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.Password)
}

UserSchema.methods.GenerateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            UserName: this.UserName,
            Role: this.Role,
            FullName: this.FullName,
            Email: this.Email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.GenerateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)