const bpmText = document.getElementById('bpm');
const spo2Text = document.getElementById('spo2');
const ctx = document.getElementById('chart').getContext('2d');

let chart;

function fetchAndUpdate() {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => {
      const recent = data[data.length - 1];
      if (recent) {
        bpmText.textContent = recent.bpm;
        spo2Text.textContent = recent.spo2;
      }

      const labels = data.map(d => new Date(d.time).toLocaleTimeString());
      const bpmValues = data.map(d => d.bpm);
      const spo2Values = data.map(d => d.spo2);

      if (!chart) {
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Heart Rate (BPM)',
                data: bpmValues,
                borderColor: 'red',
                tension: 0.3
              },
              {
                label: 'Oxygen Level (%)',
                data: spo2Values,
                borderColor: 'blue',
                tension: 0.3
              }
            ]
          },
          options: {
            animation: false,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = bpmValues;
        chart.data.datasets[1].data = spo2Values;
        chart.update();
      }
    });
}

setInterval(fetchAndUpdate, 3000);
