const socket = io();
const moodText = document.getElementById("overallMood");

/* ---------------- BAR CHART ---------------- */
const barCtx = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: ["Happy", "Neutral", "Sad", "Angry", "Surprised"],
    datasets: [{
      label: "Emotion Count",
      data: [0, 0, 0, 0, 0]
    }]
  },
  options: {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

/* ---------------- PIE CHART ---------------- */
const pieCtx = document.getElementById("pieChart").getContext("2d");
const pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Happy", "Neutral", "Sad", "Angry", "Surprised"],
    datasets: [{
      data: [0, 0, 0, 0, 0]
    }]
  }
});

/* ---------------- SOCKET UPDATE ---------------- */
socket.on("update", data => {
  const happy = data.happy;
  const neutral = data.neutral;
  const sad = data.sad;
  const angry = data.angry;
  const surprised = data.surprised;

  const total = happy + neutral + sad + angry + surprised;

  // Update bar chart
  barChart.data.datasets[0].data = [
    happy, neutral, sad, angry, surprised
  ];
  barChart.update();

  // Update pie chart
  pieChart.data.datasets[0].data = [
    happy, neutral, sad, angry, surprised
  ];
  pieChart.update();

  // Overall mood logic
  let mood = "NEUTRAL 😐";

  if (total > 0) {
    if ((happy + surprised) / total >= 0.6) {
      mood = "ENGAGED 😊";
    } else if ((sad + angry) / total >= 0.4) {
      mood = "STRESSED 😟";
    }
  }

  moodText.textContent = "Overall Mood: " + mood;
});




