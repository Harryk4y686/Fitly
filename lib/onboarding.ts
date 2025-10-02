import { supabase } from './supabase';

export interface OnboardingStep {
  step_name: string;
  completed: boolean;
  completed_at?: string;
}

export interface OnboardingProgress {
  gender: boolean;
  workout: boolean;
  birthdate: boolean;
  measurements: boolean;
  diet: boolean;
  goals: boolean;
  complete: boolean;
}

// Define the onboarding flow order
export const ONBOARDING_STEPS = [
  'gender',
  'workout', 
  'birthdate',
  'measurements',
  'diet',
  'goals',
  'complete'
] as const;

export type OnboardingStepName = typeof ONBOARDING_STEPS[number];

export const getOnboardingProgress = async (userId: string): Promise<OnboardingProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        gender,
        workout_frequency,
        age,
        height_cm,
        weight_kg,
        diet_preference,
        goal,
        onboarding_completed
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching onboarding progress:', error);
      return null;
    }

    // Determine which steps are completed based on data presence
    const progress: OnboardingProgress = {
      gender: !!data.gender,
      workout: !!data.workout_frequency,
      birthdate: !!data.age,
      measurements: !!(data.height_cm && data.weight_kg),
      diet: !!data.diet_preference,
      goals: !!data.goal,
      complete: !!data.onboarding_completed
    };

    return progress;
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    return null;
  }
};

export const getNextOnboardingStep = async (userId: string): Promise<OnboardingStepName | null> => {
  try {
    const progress = await getOnboardingProgress(userId);
    
    if (!progress) return 'gender'; // Start from beginning if no progress found

    // If onboarding is complete, return null
    if (progress.complete) return null;

    // Find the first incomplete step
    for (const step of ONBOARDING_STEPS) {
      if (!progress[step]) {
        return step;
      }
    }

    // All steps completed but not marked as complete
    return 'complete';
  } catch (error) {
    console.error('Error getting next onboarding step:', error);
    return 'gender'; // Safe fallback
  }
};

export const canAccessStep = async (userId: string, targetStep: OnboardingStepName): Promise<boolean> => {
  const progress = await getOnboardingProgress(userId);
  
  if (!progress) return targetStep === 'gender'; // Only allow gender if no progress

  // If onboarding is complete, don't allow access to any step except results
  if (progress.complete) return false;

  const targetIndex = ONBOARDING_STEPS.indexOf(targetStep);
  
  // Check if all previous steps are completed
  for (let i = 0; i < targetIndex; i++) {
    const step = ONBOARDING_STEPS[i];
    if (!progress[step]) {
      return false; // Previous step not completed
    }
  }

  // If this step is already completed, don't allow access
  if (progress[targetStep]) {
    return false;
  }

  return true;
};

export const markStepCompleted = async (userId: string, step: OnboardingStepName) => {
  // This will be handled by the individual step completion functions
  // Just used for validation
  return true;
};

export const getOnboardingRoute = async (userId: string): Promise<string> => {
  const nextStep = await getNextOnboardingStep(userId);
  
  if (!nextStep) {
    return '/(tabs)/dashboard'; // Onboarding complete
  }

  // Map step names to routes
  const stepRoutes: Record<OnboardingStepName, string> = {
    gender: '/gender',
    workout: '/workout',
    birthdate: '/birthdate',
    measurements: '/measurements',
    diet: '/diet',
    goals: '/goals',
    complete: '/results'
  };

  return stepRoutes[nextStep];
};
