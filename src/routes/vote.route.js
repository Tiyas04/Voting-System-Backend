import { Router } from "express";
import { castVote } from "../controllers/vote.controller.js";
import { verifyJWT,authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/cast").post( verifyJWT,  castVote);

export default router;