const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Serve public files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve models folder (THIS WAS MISSING)
app.use("/models", express.static(path.join(__dirname, "models")));

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("emotion", (emotion) => {
    console.log("Emotion received:", emotion);
    io.emit("emotion", emotion);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Render uses dynamic PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


