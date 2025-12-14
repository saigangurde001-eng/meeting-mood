const socket = io();

const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

startBtn.onclick = startCamera;

async function startCamera() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
  ]);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.onloadedmetadata = () => {
    video.play();
    detectEmotion();
  };
}

async function detectEmotion() {
  setInterval(async () => {
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection) {
      const expressions = detection.expressions;
      const emotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      console.log("Sent emotion:", emotion);
      socket.emit("emotion", emotion);
    }
  }, 2000);
}




