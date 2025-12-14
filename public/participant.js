console.log("participant.js loaded");

const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const socket = io();

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
  console.log("Models loaded");
});

startBtn.onclick = async () => {
  console.log("Start button clicked");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("Camera started");

    setInterval(detectEmotion, 4000);
  } catch (err) {
    console.error("Camera error:", err);
  }
};

async function detectEmotion() {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detection) {
    const expr = detection.expressions;
    const emotion = Object.keys(expr)
      .reduce((a, b) => expr[a] > expr[b] ? a : b);

    socket.emit("emotion", emotion);
  }
}

