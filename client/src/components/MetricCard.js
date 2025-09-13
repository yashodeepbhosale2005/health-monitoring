import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, color, status, trend }) => {
  const getColorClasses = (color, status) => {
    const colorMap = {
      red: {
        normal: 'text-red-600 bg-red-50',
        danger: 'text-red-700 bg-red-100 border-red-200'
      },
      blue: {
        normal: 'text-blue-600 bg-blue-50',
        danger: 'text-blue-700 bg-blue-100 border-blue-200'
      },
      green: {
        normal: 'text-green-600 bg-green-50',
        danger: 'text-green-700 bg-green-100 border-green-200'
      },
      orange: {
        normal: 'text-orange-600 bg-orange-50',
        danger: 'text-orange-700 bg-orange-100 border-orange-200'
      }
    };
    return colorMap[color]?.[status] || colorMap.red.normal;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendText = (trend) => {
    if (trend > 0) return `+${trend.toFixed(1)}`;
    if (trend < 0) return trend.toFixed(1);
    return '0.0';
  };

  const colorClasses = getColorClasses(color, status);
  const isDanger = status === 'danger';

  return (
    <div className={`metric-card ${isDanger ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-1">
              <p className={`text-2xl font-bold ${isDanger ? 'text-red-700' : 'text-gray-900'}`}>
                {value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{unit}</p>
            </div>
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon(trend)}
            <span className="text-sm text-gray-600">{getTrendText(trend)}</span>
          </div>
        )}
      </div>
      
      {isDanger && (
        <div className="mt-3 p-2 bg-red-50 rounded-md">
          <p className="text-xs text-red-700 font-medium">
            ⚠️ Critical level detected
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
