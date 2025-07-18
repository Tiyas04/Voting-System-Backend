import { Router } from "express";
import { createElection, deleteElection, getAllElections,updateElectionStatus } from "../controllers/election.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { removeCandidatefromElection } from "../controllers/admin.controller.js";

const router = Router();

router.route("/create").post(
    verifyJWT,
    authorizeRoles("Admin"),
    createElection
)
router.route("/:id").delete(verifyJWT, authorizeRoles("Admin"), deleteElection)
router.route("/").get(verifyJWT, getAllElections);
router.route("/:electionId/remove-candidate/:candidateId").delete(
    verifyJWT,
    authorizeRoles("Admin"),
    removeCandidatefromElection,
    updateElectionStatus
)

export default router;