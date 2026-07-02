import { Router } from "express";
import { createConversation } from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/",authMiddleware,createConversation)

export default router;