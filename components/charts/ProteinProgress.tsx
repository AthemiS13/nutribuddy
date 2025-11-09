'use client';

import React from 'react';

interface ProteinProgressProps {
  current: number;
  goal: number;
}

export const ProteinProgress: React.FC<ProteinProgressProps> = ({ current, goal }) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const isOver = current > goal;

  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-neutral-400 text-sm mb-1">Protein Intake</p>
          <p className="text-3xl font-bold text-neutral-50">
            {current.toFixed(1)}
            <span className="text-lg text-neutral-400 ml-2">/ {goal}g</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neutral-50">
            {percentage > 100 ? '✓' : `${Math.round(percentage)}%`}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {isOver ? 'goal met' : 'to go'}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-neutral-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              isOver ? 'bg-neutral-500' : 'bg-neutral-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {isOver && (
          <p className="text-xs text-neutral-400">
            +{(current - goal).toFixed(1)}g over goal
          </p>
        )}
      </div>
    </div>
  );
};
