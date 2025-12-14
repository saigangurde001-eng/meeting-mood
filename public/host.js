const socket = io();

// Emotion counters
const emotionCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  surprised: 0,
  neutral: 0,
  fearful: 0,
  disgusted: 0,
};

// Chart setup
const barCtx = document.getElementById("barChart").getContext("2d");
const pieCtx = document.getElementById("pieChart").getContext("2d");

const barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        label: "Emotion Count",
        data: Object.values(emotionCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  },
});

const pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        data: Object.values(emotionCounts),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#F44336",
          "#FF9800",
          "#9E9E9E",
          "#673AB7",
          "#795548",
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// Receive emotion data
socket.on("emotion", (emotion) => {
  console.log("Emotion received on host:", emotion);

  if (emotionCounts[emotion] !== undefined) {
    emotionCounts[emotion]++;
  }

  // Update charts
  barChart.data.datasets[0].data = Object.values(emotionCounts);
  barChart.update();

  pieChart.data.datasets[0].data = Object.values(emotionCounts);
  pieChart.update();

  // Update overall mood
  updateOverallMood();
});

// Overall mood logic
function updateOverallMood() {
  let maxEmotion = "neutral";
  let maxCount = 0;

  for (let emo in emotionCounts) {
    if (emotionCounts[emo] > maxCount) {
      maxCount = emotionCounts[emo];
      maxEmotion = emo;
    }
  }

  document.getElementById("overallMood").innerText =
    "Overall Mood: " + maxEmotion.toUpperCase();
}





