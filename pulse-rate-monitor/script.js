// Paste this in script.js
const ctx = document.getElementById('pulseChart').getContext('2d');

const pulseChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 20 }, (_, i) => `T${i+1}`),
    datasets: [{
      label: 'Pulse Rate (BPM)',
      data: Array.from({ length: 20 }, () => Math.floor(Math.random() * (100 - 60 + 1)) + 60),
      fill: true,
      borderColor: '#ff4d6d',
      backgroundColor: 'rgba(255, 77, 109, 0.2)',
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#ff4d6d',
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 1500,
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 120,
      }
    }
  }
});

setInterval(() => {
  pulseChart.data.datasets[0].data.shift();
  pulseChart.data.datasets[0].data.push(Math.floor(Math.random() * (100 - 60 + 1)) + 60);
  pulseChart.update();
}, 2000);
