// Simulate random data
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(() => {
  const bpm = getRandomInt(70, 100);
  const spo2 = getRandomInt(94, 100);

  document.getElementById("bpm").innerText = bpm + " BPM";
  document.getElementById("spo2").innerText = spo2 + " %";

  // Update chart (optional)
  addData(bpm, spo2);
}, 3000);

// Chart.js graph
const ctx = document.getElementById("reportChart").getContext("2d");
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: [],
        borderColor: "#d62828",
        fill: false
      },
      {
        label: "SpO2 Level (%)",
        data: [],
        borderColor: "#007f5f",
        fill: false
      }
    ]
  }
});

function addData(bpm, spo2) {
  const time = new Date().toLocaleTimeString();
  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(bpm);
  chart.data.datasets[1].data.push(spo2);
  chart.update();
}
