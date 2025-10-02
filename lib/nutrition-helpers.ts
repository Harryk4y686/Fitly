import { NutritionCalculator, UserProfileData, NutritionGoals } from './nutrition-calculator';
import { updateUserProfile } from './database';

/**
 * Calculate and save nutrition goals to the database
 */
export async function calculateAndSaveNutritionGoals(
  userId: string,
  profileData: {
    gender: string;
    age: number;
    weight: number; // in kg
    height: number; // in cm
    activityLevel: string;
    goal: string;
    dietPreference: string;
  }
): Promise<{ success: boolean; goals?: NutritionGoals; error?: string }> {
  try {
    // Validate required data
    if (!profileData.gender || !profileData.age || !profileData.weight || 
        !profileData.height || !profileData.activityLevel || !profileData.goal || 
        !profileData.dietPreference) {
      return {
        success: false,
        error: 'Missing required profile data for nutrition calculation'
      };
    }

    // Calculate nutrition goals
    const goals = NutritionCalculator.calculateNutritionGoals(profileData as UserProfileData);

    // Save to database
    const updateResult = await updateUserProfile(userId, {
      daily_calorie_goal: goals.dailyCalories,
      daily_protein_goal: goals.protein,
      daily_carbs_goal: goals.carbs,
      daily_fat_goal: goals.fats,
      // Store additional nutrition info in a JSON field if needed
      // For now, we'll just store the main macros
    });

    if (updateResult.error) {
      return {
        success: false,
        error: `Failed to save nutrition goals: ${updateResult.error.message}`
      };
    }

    console.log('✅ Nutrition goals calculated and saved:', goals);
    
    return {
      success: true,
      goals
    };

  } catch (error) {
    console.error('Error calculating nutrition goals:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get nutrition recommendations based on diet preference
 */
export function getNutritionRecommendations(dietPreference: string) {
  return NutritionCalculator.getDietRecommendations(dietPreference);
}

/**
 * Convert weight from pounds to kg if needed
 */
export function convertWeightToKg(weight: number, unit: 'kg' | 'lbs' = 'kg'): number {
  if (unit === 'lbs') {
    return NutritionCalculator.poundsToKg(weight);
  }
  return weight;
}

/**
 * Convert height from feet/inches to cm if needed
 */
export function convertHeightToCm(
  height: number | { feet: number; inches: number },
  unit: 'cm' | 'ft' = 'cm'
): number {
  if (unit === 'ft' && typeof height === 'object') {
    return NutritionCalculator.feetInchesToCm(height.feet, height.inches);
  }
  return typeof height === 'number' ? height : 0;
}

/**
 * Format nutrition goals for display
 */
export function formatNutritionGoals(goals: NutritionGoals) {
  return {
    calories: `${goals.dailyCalories} kcal`,
    protein: `${goals.protein}g`,
    carbs: `${goals.carbs}g`,
    fats: `${goals.fats}g`,
    fiber: `${goals.fiber}g`,
    sugar: `≤${goals.sugar}g`,
    sodium: `≤${Math.round(goals.sodium)}mg`
  };
}

/**
 * Get a summary of the nutrition calculation
 */
export function getNutritionSummary(profile: UserProfileData, goals: NutritionGoals) {
  const bmr = NutritionCalculator.calculateBMR(profile.gender, profile.age, profile.weight, profile.height);
  const tdee = NutritionCalculator.calculateTDEE(bmr, profile.activityLevel);
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieAdjustment: goals.dailyCalories - Math.round(tdee),
    proteinPerKg: Math.round((goals.protein / profile.weight) * 10) / 10,
    macroBreakdown: {
      proteinPercent: Math.round((goals.protein * 4 / goals.dailyCalories) * 100),
      carbsPercent: Math.round((goals.carbs * 4 / goals.dailyCalories) * 100),
      fatsPercent: Math.round((goals.fats * 9 / goals.dailyCalories) * 100)
    }
  };
}
