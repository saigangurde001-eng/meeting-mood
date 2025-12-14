const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

const socket = io(); // auto-connects to same domain

// Load face-api models
async function loadModels() {
  const MODEL_URL = "/models";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

// Start webcam
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

// Detect emotions and send to server
async function detectEmotion() {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detection && detection.expressions) {
    const expressions = detection.expressions;

    // Get highest emotion
    const emotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    socket.emit("emotion", emotion);
  }
}

// Button click
startBtn.addEventListener("click", async () => {
  await loadModels();
  await startCamera();

  video.addEventListener("play", () => {
    setInterval(detectEmotion, 1500);
  });
});



