const socket = io();

const emotionCounts = {
  happy: 0,
  sad: 0,
  angry: 0,
  neutral: 0,
  surprised: 0,
  fearful: 0,
  disgusted: 0
};

// BAR CHART
const barChart = new Chart(
  document.getElementById("barChart"),
  {
    type: "bar",
    data: {
      labels: Object.keys(emotionCounts),
      datasets: [{
        label: "Emotion Count",
        data: Object.values(emotionCounts),
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }]
    },
    options: { responsive: true }
  }
);

// PIE CHART
const pieChart = new Chart(
  document.getElementById("pieChart"),
  {
    type: "pie",
    data: {
      labels: Object.keys(emotionCounts),
      datasets: [{
        data: Object.values(emotionCounts),
        backgroundColor: [
          "#4CAF50", "#2196F3", "#F44336",
          "#9E9E9E", "#FFC107", "#673AB7", "#FF5722"
        ]
      }]
    }
  }
);

// SOCKET
socket.on("emotionUpdate", (emotion) => {
  console.log("Host received:", emotion);
  emotionCounts[emotion]++;
  updateCharts();
  updateOverallMood();
});

function updateCharts() {
  barChart.data.datasets[0].data = Object.values(emotionCounts);
  barChart.update();

  pieChart.data.datasets[0].data = Object.values(emotionCounts);
  pieChart.update();
}

function updateOverallMood() {
  const overall = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );
  document.getElementById("overallMood").innerText = overall;
}









