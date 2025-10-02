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
