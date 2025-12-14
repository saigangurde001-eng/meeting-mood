const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Use PORT provided by hosting platform (Render) or fallback to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder
app.use(express.static("public"));

// Emotion counts
let emotionCounts = {
  happy: 0,
  neutral: 0,
  sad: 0,
  angry: 0,
  surprised: 0
};

// Socket connection
io.on("connection", socket => {
  console.log("A user connected");

  // Receive emotion from participant
  socket.on("emotion", emotion => {
    if (emotionCounts[emotion] !== undefined) {
      emotionCounts[emotion]++;
    }

    // Send updated data to host
    io.emit("update", emotionCounts);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// IMPORTANT: Listen on 0.0.0.0 and dynamic PORT
http.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

