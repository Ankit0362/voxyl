import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendLineChart = ({ participationByDate = [] }) => {
  if (!participationByDate || participationByDate.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">Not enough data to display trend</p>
      </div>
    );
  }

  const data = participationByDate.map(item => {
    const d = new Date(item.date);
    return {
      dateObj: d,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.count
    };
  }).sort((a, b) => a.dateObj - b.dateObj); 

  let cumulativeCount = 0;
  const cumulativeData = data.map(item => {
    cumulativeCount += item.count;
    return {
      ...item,
      cumulative: cumulativeCount
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-bold text-gray-800">{payload[0].payload.displayDate}</p>
          <p className="text-primary-600 font-bold mt-1">Total Responses: {payload[0].payload.cumulative}</p>
          <p className="text-gray-500 font-medium text-xs mt-0.5">+{payload[0].payload.count} on this day</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      {cumulativeData.length === 1 && (
        <p className="text-xs text-gray-500 font-medium italic mb-2 text-center">Trend will appear as more responses come in over multiple days.</p>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={cumulativeData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCumulative)" 
            activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;
