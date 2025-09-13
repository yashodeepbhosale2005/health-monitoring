import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartComponent = ({ data, darkMode }) => {
  // Process data for the chart
  const chartData = data.slice(0, 20).reverse().map((item, index) => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    pulse: item.pulseRate,
    spo2: item.spo2,
    steps: item.steps,
    calories: item.calories
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#ffffff' : '#374151',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Health Trends Over Time',
        color: darkMode ? '#ffffff' : '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        titleColor: darkMode ? '#ffffff' : '#374151',
        bodyColor: darkMode ? '#ffffff' : '#374151',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const chartDataConfig = {
    labels: chartData.map(d => d.time),
    datasets: [
      {
        label: 'Pulse Rate (BPM)',
        data: chartData.map(d => d.pulse),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'SpO₂ (%)',
        data: chartData.map(d => d.spo2),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  // Add secondary y-axis for SpO2
  const updatedOptions = {
    ...options,
    scales: {
      ...options.scales,
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      }
    }
  };

  return (
    <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Health Trends
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Pulse Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>SpO₂</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        {data.length === 0 ? (
          <div className={`flex items-center justify-center h-80 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Health data will appear here once sensors start sending data</p>
            </div>
          </div>
        ) : (
          <Line data={chartDataConfig} options={updatedOptions} />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
