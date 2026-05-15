import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChartQuestion = ({ question }) => {
  if (!question || !question.options) return null;

  const maxCount = Math.max(...question.options.map(o => o.count || 0));

  const data = question.options.map(opt => ({
    name: opt.text.length > 30 ? opt.text.substring(0, 30) + '...' : opt.text,
    fullText: opt.text,
    count: opt.count || 0,
    percentage: opt.percentage || 0
  })).sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-semibold text-gray-800 mb-1">{dataPoint.fullText}</p>
          <p className="text-primary-600 font-bold">Votes: {dataPoint.count}</p>
          <p className="text-gray-500 font-medium">Percentage: {dataPoint.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const chartHeight = Math.max(200, data.length * 50 + 50);

  return (
    <div style={{ width: '100%', height: chartHeight }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 600 }}
            width={120}
          />
          <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.count === maxCount && maxCount > 0 ? '#f59e0b' : '#4f46e5'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartQuestion;
