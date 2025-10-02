import { supabase } from './supabase';
import { safeUpdateUserProfile } from './auth-helpers';

export interface UserProfile {
  id: string;
  gender?: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  goal?: string;
  diet_preference?: string;
  workout_frequency?: string;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_carbs_goal?: number;
  daily_fat_goal?: number;
  onboarding_completed: boolean;
  streak_count?: number;
  last_login_date?: string;
  best_streak?: number;
}

export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }

    return data?.onboarding_completed || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  console.log('=== DATABASE UPDATE START (using safe update) ===');
  
  const result = await safeUpdateUserProfile(userId, updates);
  
  if (result.success) {
    return { data: result.data, error: null };
  } else {
    return { data: null, error: result.error };
  }
};

export const completeOnboarding = async (userId: string) => {
  return updateUserProfile(userId, { onboarding_completed: true });
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get yesterday's date in YYYY-MM-DD format
const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const updateLoginStreak = async (userId: string): Promise<{ streakCount: number; bestStreak: number } | null> => {
  try {
    console.log('=== UPDATING LOGIN STREAK ===');
    
    // Get current user profile
    const profile = await getUserProfile(userId);
    if (!profile) {
      console.error('User profile not found');
      return null;
    }

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const lastLoginDate = profile.last_login_date;
    
    console.log('Today:', today);
    console.log('Yesterday:', yesterday);
    console.log('Last login date:', lastLoginDate);

    let newStreakCount = profile.streak_count || 0;
    let newBestStreak = profile.best_streak || 0;

    if (lastLoginDate === today) {
      // Already logged in today, do nothing
      console.log('Already logged in today, streak unchanged');
      return { streakCount: newStreakCount, bestStreak: newBestStreak };
    } else if (lastLoginDate === yesterday) {
      // Logged in yesterday, increment streak
      newStreakCount = (profile.streak_count || 0) + 1;
      console.log('Logged in yesterday, incrementing streak to:', newStreakCount);
    } else {
      // Missed a day or first login, reset streak to 1
      newStreakCount = 1;
      console.log('Missed a day or first login, resetting streak to 1');
    }

    // Update best streak if current streak is higher
    if (newStreakCount > newBestStreak) {
      newBestStreak = newStreakCount;
      console.log('New best streak:', newBestStreak);
    }

    // Update the database
    const { error } = await updateUserProfile(userId, {
      streak_count: newStreakCount,
      last_login_date: today,
      best_streak: newBestStreak,
    });

    if (error) {
      console.error('Error updating streak:', error);
      return null;
    }

    console.log('Streak updated successfully');
    return { streakCount: newStreakCount, bestStreak: newBestStreak };
  } catch (error) {
    console.error('Error in updateLoginStreak:', error);
    return null;
  }
};
