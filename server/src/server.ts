import { createServer } from "http";
import app from "./app.js";
import { initializeSocket } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});