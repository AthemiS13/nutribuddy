import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, DailyStats } from './types';
import { format, parseISO, differenceInDays } from 'date-fns';

/**
 * Check if user met their daily goals (both calorie and protein)
 */
export const metDailyGoals = (
  stats: DailyStats,
  userProfile: UserProfile
): boolean => {
  const metCalories = stats.totalCalories >= userProfile.dailyCalorieGoal;
  const metProtein = userProfile.dailyProteinGoal
    ? stats.totalProtein >= userProfile.dailyProteinGoal
    : true; // If no protein goal set, consider it met
  
  return metCalories && metProtein;
};

/**
 * Calculate and update user's streak based on today's stats
 * Returns the updated streak value
 */
export const updateStreak = async (
  userId: string,
  todayStats: DailyStats,
  userProfile: UserProfile
): Promise<{ currentStreak: number; longestStreak: number }> => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const goalsMet = metDailyGoals(todayStats, userProfile);
    
    let currentStreak = userProfile.currentStreak || 0;
    let longestStreak = userProfile.longestStreak || 0;
    const lastStreakDate = userProfile.lastStreakDate;

    // If goals met today
    if (goalsMet) {
      // Check if this is a new day or updating the same day
      if (lastStreakDate === today) {
        // Same day update, don't increment streak
        // Streak stays the same
      } else if (lastStreakDate) {
        // Check if yesterday was the last streak date
        const lastDate = parseISO(lastStreakDate);
        const daysDiff = differenceInDays(parseISO(today), lastDate);
        
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          currentStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken - start new streak
          currentStreak = 1;
        }
        // daysDiff === 0 shouldn't happen but treat as same day
      } else {
        // First ever streak day
        currentStreak = 1;
      }

      // Update longest streak if current exceeds it
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      // Update Firebase
      if (!db) throw new Error('Firestore not initialized');
      const userRef = doc(db as any, 'users', userId);
      await updateDoc(userRef, {
        currentStreak,
        longestStreak,
        lastStreakDate: today,
        updatedAt: new Date().toISOString(),
      });

      return { currentStreak, longestStreak };
    } else {
      // Goals not met - check if we need to break the streak
      if (lastStreakDate) {
        const lastDate = parseISO(lastStreakDate);
        const daysDiff = differenceInDays(parseISO(today), lastDate);
        
        // If more than 1 day since last successful day, break streak
        if (daysDiff > 1) {
          currentStreak = 0;
          
          if (!db) throw new Error('Firestore not initialized');
          const userRef = doc(db as any, 'users', userId);
          await updateDoc(userRef, {
            currentStreak: 0,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      
      return { currentStreak, longestStreak };
    }
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

/**
 * Get streak status message
 */
export const getStreakMessage = (currentStreak: number): string => {
  if (currentStreak === 0) return 'Start your streak today!';
  if (currentStreak === 1) return 'Great start!';
  if (currentStreak < 7) return 'Keep it going!';
  if (currentStreak < 30) return 'You\'re on fire!';
  return 'Incredible dedication!';
};
