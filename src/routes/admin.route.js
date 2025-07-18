import { Router } from "express";
import { reviewApplication } from "../controllers/admin.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:appId/review").post(
    verifyJWT,
    authorizeRoles("Admin"),
    reviewApplication
)


export default router;