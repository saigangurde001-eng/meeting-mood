const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/models", express.static(path.join(__dirname, "models")));

// ------------------ PARTICIPANT COUNT ------------------
let activeUsers = 0;

io.on("connection", (socket) => {
  activeUsers++;
  io.emit("participantCount", activeUsers);

  console.log("User connected:", socket.id, "Active:", activeUsers);

  // Emotion data from participant
  socket.on("emotion", (emotion) => {
    io.emit("emotionUpdate", emotion);
  });

  socket.on("disconnect", () => {
    activeUsers--;
    io.emit("participantCount", activeUsers);
    console.log("User disconnected:", socket.id, "Active:", activeUsers);
  });
});

// Render-compatible port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





