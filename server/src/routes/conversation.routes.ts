import { Router } from "express";
import { createConversation,getConversations } from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/",authMiddleware,createConversation)
router.get("/", authMiddleware, getConversations);

export default router;