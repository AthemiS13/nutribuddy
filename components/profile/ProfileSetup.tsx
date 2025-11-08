'use client';

import React, { useState } from 'react';
import { createUserProfile } from '@/lib/user-service';

interface ProfileSetupProps {
  uid: string;
  email: string;
  onComplete: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ uid, email, onComplete }) => {
  const [bodyWeight, setBodyWeight] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('');
  const [targetMonthlyWeightChange, setTargetMonthlyWeightChange] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const profile = {
        uid,
        email,
        bodyWeight: parseFloat(bodyWeight),
        dailyCalorieGoal: parseInt(dailyCalorieGoal),
        ...(targetMonthlyWeightChange && {
          targetMonthlyWeightChange: parseFloat(targetMonthlyWeightChange),
        }),
      };

      await createUserProfile(profile);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Body Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="70.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Daily Calorie Goal (kcal)
          </label>
          <input
            type="number"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Monthly Weight Change (kg) - Optional
          </label>
          <input
            type="number"
            step="0.1"
            value={targetMonthlyWeightChange}
            onChange={(e) => setTargetMonthlyWeightChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.5 (positive for gain, negative for loss)"
          />
          <p className="text-xs text-gray-400 mt-1">
            Use positive numbers to gain weight, negative to lose weight
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Creating Profile...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
};
