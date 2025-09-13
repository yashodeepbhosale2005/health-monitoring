import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';

const HealthChart = ({ data }) => {
  // Process data for the chart
  const chartData = data.slice(0, 20).reverse().map((item, index) => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    pulse: item.pulseRate,
    spo2: item.spo2,
    steps: item.steps,
    calories: item.calories
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'pulse' ? ' BPM' : entry.dataKey === 'spo2' ? '%' : entry.dataKey === 'steps' ? ' steps' : ' cal'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Health Trends</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Pulse Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">SpO₂</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="pulse"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Pulse Rate (BPM)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="spo2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
              name="SpO₂ (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {data.length === 0 && (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Health data will appear here once sensors start sending data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthChart;
