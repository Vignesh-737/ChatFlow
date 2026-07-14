import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import conversationRoutes from "./routes/conversation.routes.js"
import messageRoutes from "./routes/message.routes.js";
import cors from "cors"

const app = express();

app.use(express.json());

app.use(cors())

app.use("/api/auth",authRoutes);

app.use("/api/users",userRoutes);

app.use("/api/conversations",conversationRoutes);

app.use("/api/messages", messageRoutes);


export default app;