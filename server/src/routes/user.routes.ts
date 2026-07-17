import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.get("/",authMiddleware,getAllUsers)


export default router;