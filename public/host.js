const socket = io();

const overallMoodText = document.getElementById("overallMood");

const emotions = ["happy", "sad", "angry", "neutral", "surprise", "fear", "disgust"];
const emotionCounts = {};

emotions.forEach((e) => (emotionCounts[e] = 0));

/* ---------------- BAR CHART ---------------- */
const barCtx = document.getElementById("barChart").getContext("2d");

const barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: emotions,
    datasets: [
      {
        label: "Emotion Count",
        data: emotions.map((e) => emotionCounts[e]),
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

/* ---------------- PIE CHART ---------------- */
const pieCtx = document.getElementById("pieChart").getContext("2d");

const pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: emotions,
    datasets: [
      {
        data: emotions.map((e) => emotionCounts[e]),
      },
    ],
  },
});

/* ---------------- SOCKET ---------------- */
socket.on("emotion", (emotion) => {
  if (!emotionCounts[emotion]) return;

  emotionCounts[emotion]++;

  // Update charts
  barChart.data.datasets[0].data = emotions.map((e) => emotionCounts[e]);
  barChart.update();

  pieChart.data.datasets[0].data = emotions.map((e) => emotionCounts[e]);
  pieChart.update();

  // Overall mood logic
  const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  overallMoodText.innerText = dominantEmotion.toUpperCase();
});






