// src/TrendChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TrendChart({ diaries }) {
  // 准备图表需要的数据格式，并筛选出有评分的日记
  const chartData = diaries
    .filter(d => d.ai_score !== null)
    .map(d => ({
      // 为了图表美观，只显示日期部分
      date: d.date.substring(5), // e.g., "09-Day13"
      score: d.ai_score,
    }))
    .reverse(); // 反转数组，让日期从左到右递增

  if (chartData.length < 2) {
    return <p>记录两次以上AI评分后，将在此显示趋势图。</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>AI评分趋势</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} name="每日评分" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}