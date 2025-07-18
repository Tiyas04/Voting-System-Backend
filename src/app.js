import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
import electionRouter from "./routes/election.route.js"
import candidateRouter from "./routes/candidate.route.js"
import voteRouter from "./routes/vote.route.js"
import adminRouter from "./routes/admin.route.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({
    limit:"100kb"
}))
app.use(express.urlencoded({
    limit:"100kb",
    extended: true
}))
app.use(cookieParser())
app.use(express.static("public"))
app.use("/api/user",userRouter)
app.use("/api/election",electionRouter)
app.use("/api/candidates",candidateRouter)
app.use("/api/votes",voteRouter)
app.use("/api/admin",adminRouter)

export default app