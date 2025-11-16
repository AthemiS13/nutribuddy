"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";

interface CalorieChartProps {
  data: Array<{
    date: string;
    calories: number;
    goal: number;
    protein?: number;
  }>;
  metric?: "calories" | "protein";
  goal?: number;
}

export const CalorieChart: React.FC<CalorieChartProps> = ({ data, metric = "calories" }) => {
  const renderTopValueLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (x == null || y == null || width == null) return null;
    const cx = x + width / 2;
    const n = Number(value) || 0;
    const text = n.toFixed(0);
    return (
      <text x={cx} y={y - 6} fill="#f5f5f5" textAnchor="middle" fontSize={12}>
        {text}
      </text>
    );
  };

  return (
    <div className="w-full h-full min-h-[250px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        {/* simple bars only; axes hidden, no tooltip/legend, no interactions */}
        <BarChart
          data={data}
          margin={{ top: 8, right: 10, left: 10, bottom: 24 }}
          style={{ pointerEvents: "none" }}
        >
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{ fill: "#a3a3a3", fontSize: 12 }}
          />
          <YAxis hide domain={[0, (dataMax: number) => (isFinite(dataMax) ? dataMax * 1.2 : 0)] as any} />

          <Bar dataKey={metric} fill="#ef4444" isAnimationActive={false} radius={[6, 6, 6, 6]}>
            <LabelList dataKey={metric} content={renderTopValueLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
