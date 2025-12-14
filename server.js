const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));

// Optional: redirect root to host dashboard
app.get("/", (req, res) => {
  res.redirect("/host.html");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Receive emotion from participant
  socket.on("emotion", (emotion) => {
    console.log("Emotion received:", emotion);

    // Broadcast emotion to all connected clients (host)
    io.emit("emotion", emotion);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// IMPORTANT: Render uses dynamic PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

