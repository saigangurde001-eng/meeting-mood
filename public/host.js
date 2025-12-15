const socket = io();

// ------------------ DATA ------------------
const emotionCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  neutral: 0,
  surprised: 0,
  fearful: 0,
  disgusted: 0
};

const emotionHistory = [];
const HISTORY_LIMIT = 20;

// ------------------ PARTICIPANT COUNT ------------------
socket.on("participantCount", (count) => {
  document.getElementById("participantCount").innerText = count;
});

// ------------------ BAR CHART ------------------
const barChart = new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: Object.keys(emotionCounts),
    datasets: [{
      label: "Emotion %",
      data: [],
      backgroundColor: "rgba(79, 172, 254, 0.7)"
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: v => v + "%" }
      }
    }
  }
});

// ------------------ PIE CHART ------------------
const pieChart = new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: Object.keys(emotionCounts),
    datasets: [{
      data: [],
      backgroundColor: [
        "#4CAF50", "#2196F3", "#F44336",
        "#9E9E9E", "#FFC107", "#673AB7", "#FF5722"
      ]
    }]
  }
});

// ------------------ SOCKET ------------------
socket.on("emotionUpdate", (emotion) => {
  if (!emotionCounts.hasOwnProperty(emotion)) return;

  emotionHistory.push(emotion);
  if (emotionHistory.length > HISTORY_LIMIT) emotionHistory.shift();

  updateEmotionStats();
});

// ------------------ FUNCTIONS ------------------
function updateEmotionStats() {
  Object.keys(emotionCounts).forEach(e => emotionCounts[e] = 0);
  emotionHistory.forEach(e => emotionCounts[e]++);

  const total = emotionHistory.length || 1;

  const percentages = Object.values(emotionCounts).map(
    c => Math.round((c / total) * 100)
  );

  barChart.data.datasets[0].data = percentages;
  barChart.update();

  pieChart.data.datasets[0].data = percentages;
  pieChart.update();

  updateOverallMood();
}

function updateOverallMood() {
  const dominant = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  const moodEl = document.getElementById("overallMood");
  moodEl.innerText = dominant.toUpperCase();

  const colors = {
    happy: "#4CAF50",
    surprised: "#FFC107",
    neutral: "#9E9E9E",
    sad: "#2196F3",
    angry: "#F44336",
    fearful: "#673AB7",
    disgusted: "#FF5722"
  };

  moodEl.style.color = colors[dominant] || "#333";
}

// ------------------ DARK MODE ------------------
const toggleBtn = document.getElementById("darkToggle");

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");

  toggleBtn.innerText = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
};












