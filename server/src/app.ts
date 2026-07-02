import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import conversationRoutes from "./routes/conversation.routes.js"

const app = express();

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/conversations",conversationRoutes);


export default app;