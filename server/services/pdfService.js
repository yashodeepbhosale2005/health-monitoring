const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment');

const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generatePDFReport(healthData, stats, options = {}) {
  try {
    // Generate charts
    const pulseChart = await generatePulseChart(healthData);
    const spo2Chart = await generateSpo2Chart(healthData);
    const stepsChart = await generateStepsChart(healthData);

    // Create HTML content for PDF
    const htmlContent = generateHTMLReport(healthData, stats, {
      pulseChart,
      spo2Chart,
      stepsChart,
      ...options
    });

    // For now, we'll return a simple text-based report
    // In a production environment, you would use puppeteer or similar to generate actual PDF
    const reportContent = `
HEALTH MONITORING REPORT
========================

Period: ${options.month || 'Current'}/${options.year || new Date().getFullYear()}

STATISTICS
----------
Average Pulse Rate: ${stats.averagePulse} BPM
Min Pulse Rate: ${stats.minPulse} BPM
Max Pulse Rate: ${stats.maxPulse} BPM

Average SpO₂: ${stats.averageSpo2}%
Min SpO₂: ${stats.minSpo2}%
Max SpO₂: ${stats.maxSpo2}%

Total Steps: ${stats.totalSteps.toLocaleString()}
Total Calories: ${stats.totalCalories.toLocaleString()}

Data Points: ${stats.dataPoints}
Emergency Alerts: ${stats.emergencyCount}

Generated on: ${new Date().toLocaleString()}
    `;

    return Buffer.from(reportContent, 'utf8');

  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
}

async function generatePulseChart(healthData) {
  const labels = healthData.map(d => moment(d.timestamp).format('MM/DD HH:mm'));
  const data = healthData.map(d => d.pulseRate);

  const configuration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pulse Rate (BPM)',
        data: data,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Pulse Rate Over Time'
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(0, Math.min(...data) - 10),
          max: Math.max(...data) + 10
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateSpo2Chart(healthData) {
  const labels = healthData.map(d => moment(d.timestamp).format('MM/DD HH:mm'));
  const data = healthData.map(d => d.spo2);

  const configuration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'SpO₂ (%)',
        data: data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'SpO₂ Over Time'
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(0, Math.min(...data) - 5),
          max: 100
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateStepsChart(healthData) {
  const labels = healthData.map(d => moment(d.timestamp).format('MM/DD'));
  const data = healthData.map(d => d.steps);

  const configuration = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Steps',
        data: data,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Daily Steps'
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

function generateHTMLReport(healthData, stats, options) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Health Monitoring Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; }
        .chart { margin: 20px 0; text-align: center; }
        .emergency { color: #ef4444; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Health Monitoring Report</h1>
        <p>Period: ${options.month || 'Current'}/${options.year || new Date().getFullYear()}</p>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Pulse Rate</h3>
          <p>Average: ${stats.averagePulse} BPM</p>
          <p>Range: ${stats.minPulse} - ${stats.maxPulse} BPM</p>
        </div>
        <div class="stat-card">
          <h3>SpO₂</h3>
          <p>Average: ${stats.averageSpo2}%</p>
          <p>Range: ${stats.minSpo2} - ${stats.maxSpo2}%</p>
        </div>
        <div class="stat-card">
          <h3>Activity</h3>
          <p>Total Steps: ${stats.totalSteps.toLocaleString()}</p>
          <p>Total Calories: ${stats.totalCalories.toLocaleString()}</p>
        </div>
        <div class="stat-card">
          <h3>Summary</h3>
          <p>Data Points: ${stats.dataPoints}</p>
          <p class="emergency">Emergency Alerts: ${stats.emergencyCount}</p>
        </div>
      </div>
      
      <div class="chart">
        <h3>Pulse Rate Chart</h3>
        <img src="data:image/png;base64,${options.pulseChart.toString('base64')}" />
      </div>
      
      <div class="chart">
        <h3>SpO₂ Chart</h3>
        <img src="data:image/png;base64,${options.spo2Chart.toString('base64')}" />
      </div>
      
      <div class="chart">
        <h3>Steps Chart</h3>
        <img src="data:image/png;base64,${options.stepsChart.toString('base64')}" />
      </div>
      
      <footer style="margin-top: 40px; text-align: center; color: #6b7280;">
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Health Monitoring Smart Band System</p>
      </footer>
    </body>
    </html>
  `;
}

module.exports = { generatePDFReport };
