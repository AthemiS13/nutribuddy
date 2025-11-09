'use client';

import React, { useEffect, useState } from 'react';
import { getDailyStats, deleteMeal } from '@/lib/meal-service';
import { DailyStats, MealLog, UserProfile } from '@/lib/types';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays } from 'date-fns';
import { Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  userId: string;
  userProfile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId, userProfile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId, currentDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const dailyStats = await getDailyStats(userId, currentDate);
      setStats(dailyStats);

      // Load last 7 days for trend
      const weekData: DailyStats[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(currentDate, i);
        const dayStats = await getDailyStats(userId, date);
        weekData.push(dayStats);
      }
      setWeeklyData(weekData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      await deleteMeal(userId, mealId);
      loadData();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const calorieProgress = (stats.totalCalories / userProfile.dailyCalorieGoal) * 100;
  const remainingCalories = userProfile.dailyCalorieGoal - stats.totalCalories;

  const macroData = {
    labels: ['Protein', 'Fats', 'Carbs'],
    datasets: [
      {
        data: [stats.totalProtein * 4, stats.totalFats * 9, stats.totalCarbohydrates * 4],
        backgroundColor: ['#737373', '#525252', '#404040'],
        borderColor: ['#a3a3a3', '#737373', '#525252'],
        borderWidth: 2,
      },
    ],
  };

  const weeklyCaloriesData = {
    labels: weeklyData.map((day) => format(new Date(day.date), 'EEE')),
    datasets: [
      {
        label: 'Calories',
        data: weeklyData.map((day) => day.totalCalories),
        borderColor: '#a3a3a3',
        backgroundColor: 'rgba(163, 163, 163, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Goal',
        data: weeklyData.map(() => userProfile.dailyCalorieGoal),
        borderColor: '#737373',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#f5f5f5',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#a3a3a3' },
        grid: { color: '#262626' },
      },
      x: {
        ticks: { color: '#a3a3a3' },
        grid: { color: '#262626' },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="bg-neutral-900 p-4 rounded-lg flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-neutral-800 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-50" />
        </button>
        <h2 className="text-xl font-bold text-neutral-50">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-neutral-800 rounded-lg transition"
          disabled={format(currentDate, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className="w-5 h-5 text-neutral-50" />
        </button>
      </div>

      {/* Calorie Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 p-6 rounded-lg">
          <p className="text-neutral-400 text-sm mb-2">Calories Consumed</p>
          <p className="text-3xl font-bold text-neutral-50">{stats.totalCalories.toFixed(0)}</p>
          <div className="mt-2 bg-neutral-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                calorieProgress > 100 ? 'bg-red-500' : 'bg-neutral-400'
              }`}
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <p className="text-neutral-400 text-sm mb-2">Daily Goal</p>
          <p className="text-3xl font-bold text-neutral-50">{userProfile.dailyCalorieGoal}</p>
          <p className="text-sm text-neutral-400 mt-2">kcal target</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <p className="text-neutral-400 text-sm mb-2">Remaining</p>
          <p className="text-3xl font-bold text-neutral-50">
            {Math.abs(remainingCalories).toFixed(0)}
          </p>
          <p className="text-sm text-neutral-400 mt-2">
            {remainingCalories >= 0 ? 'kcal left' : 'kcal over'}
          </p>
        </div>
      </div>

      {/* Macronutrients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-50 mb-4">Macronutrient Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={macroData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#f5f5f5' },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-neutral-400 text-xs">Protein</p>
              <p className="text-neutral-50 text-lg font-bold">{stats.totalProtein.toFixed(1)}g</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-400 text-xs">Fats</p>
              <p className="text-neutral-50 text-lg font-bold">{stats.totalFats.toFixed(1)}g</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-400 text-xs">Carbs</p>
              <p className="text-neutral-50 text-lg font-bold">{stats.totalCarbohydrates.toFixed(1)}g</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-50 mb-4">7-Day Calorie Trend</h3>
          <div className="h-64">
            <Line data={weeklyCaloriesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Meal Log */}
      <div className="bg-neutral-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-50 mb-4">Today's Meals</h3>
        {stats.meals.length === 0 ? (
          <p className="text-neutral-400 text-center py-4">No meals logged yet today</p>
        ) : (
          <div className="space-y-3">
            {stats.meals.map((meal) => (
              <div key={meal.id} className="bg-neutral-800 p-4 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-neutral-50 font-semibold">{meal.recipeName}</h4>
                  <p className="text-neutral-400 text-sm">{meal.mass}g</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-neutral-400">{meal.nutrients.calories.toFixed(0)} kcal</span>
                    <span className="text-neutral-400">P: {meal.nutrients.protein.toFixed(1)}g</span>
                    <span className="text-neutral-400">F: {meal.nutrients.fats.toFixed(1)}g</span>
                    <span className="text-neutral-400">C: {meal.nutrients.carbohydrates.toFixed(1)}g</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
