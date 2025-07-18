import { Router } from "express"
import { verifyJWT,authorizeRoles } from "../middlewares/auth.middleware.js"
import { ApplyAsCandidate } from "../controllers/candidate.controller.js"

const router = Router()

router.route("/:electionId/apply").post(
    verifyJWT,
    authorizeRoles("Candidate"),
    ApplyAsCandidate
)

export default router