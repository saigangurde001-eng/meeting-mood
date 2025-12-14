const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from public folder
app.use(express.static("public"));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Receive emotion from participant and broadcast to host
  socket.on("emotion", (emotion) => {
    console.log("Emotion received from participant:", emotion);
    io.emit("emotion", emotion);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Use Render / local port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

