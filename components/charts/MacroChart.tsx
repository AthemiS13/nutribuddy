'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface MacroChartProps {
  protein: number;
  fats: number;
  carbs: number;
}

export const MacroChart: React.FC<MacroChartProps> = ({ protein, fats, carbs }) => {
  // Use raw gram amounts so the pie visually represents portion by weight (grams)
  const totalGrams = protein + fats + carbs;

  const data = [
    { name: 'Protein', value: protein, percentage: totalGrams > 0 ? ((protein / totalGrams) * 100).toFixed(1) : '0' },
    { name: 'Fats', value: fats, percentage: totalGrams > 0 ? ((fats / totalGrams) * 100).toFixed(1) : '0' },
    { name: 'Carbs', value: carbs, percentage: totalGrams > 0 ? ((carbs / totalGrams) * 100).toFixed(1) : '0' },
  ];

  // Neutral grayscale palette with good contrast: light gray, medium gray, dark gray
  const COLORS = ['#e5e5e5', '#a3a3a3', '#525252'];

  // static, no tooltip or interaction per new UX

  return (
    <div className="w-full h-full min-h-[250px] flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={false}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
            ))}
          </Pie>
          {/* Static pie: no tooltip or interactive legend per request */}
        </PieChart>
      </ResponsiveContainer>
      {/* No overlay — figures are shown below the chart in matching colors */}
    </div>
  );
};
