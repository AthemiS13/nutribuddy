'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { getStreakMessage } from '@/lib/streak-service';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  goalsMet: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  goalsMet,
}) => {
  const message = getStreakMessage(currentStreak);
  
  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${
            currentStreak > 0 ? 'bg-orange-500/20' : 'bg-neutral-800'
          }`}>
            <Flame className={`w-6 h-6 ${
              currentStreak > 0 ? 'text-orange-500' : 'text-neutral-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-50">Goal Streak</h3>
            <p className="text-xs text-neutral-400">{message}</p>
          </div>
        </div>
        
        {goalsMet && (
          <div className="text-green-500 text-xs font-medium px-3 py-1 bg-green-500/10 rounded-full">
            ✓ Today
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-800 p-4 rounded-lg">
          <p className="text-neutral-400 text-xs mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-neutral-50">
            {currentStreak}
            <span className="text-base text-neutral-400 ml-1">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>
        
        <div className="bg-neutral-800 p-4 rounded-lg">
          <p className="text-neutral-400 text-xs mb-1">Longest Streak</p>
          <p className="text-3xl font-bold text-neutral-50">
            {longestStreak}
            <span className="text-base text-neutral-400 ml-1">
              {longestStreak === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">
          Meet your daily calorie and protein goals to build your streak
        </p>
      </div>
    </div>
  );
};
