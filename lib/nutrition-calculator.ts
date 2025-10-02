export interface UserProfileData {
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  dietPreference: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan';
}

export interface NutritionGoals {
  dailyCalories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber: number; // grams
  sugar: number; // grams (max recommended)
  sodium: number; // mg (max recommended)
}

export class NutritionCalculator {
  /**
   * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
   */
  static calculateBMR(gender: string, age: number, weight: number, height: number): number {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      // For female and other
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Calculate Total Daily Energy Expenditure (TDEE) based on activity level
   */
  static calculateTDEE(bmr: number, activityLevel: string): number {
    const activityMultipliers = {
      sedentary: 1.2,      // Little to no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Heavy exercise 6-7 days/week
      very_active: 1.9     // Very heavy exercise, physical job
    };

    return bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55);
  }

  /**
   * Adjust calories based on weight goal
   */
  static adjustCaloriesForGoal(tdee: number, goal: string): number {
    switch (goal) {
      case 'lose_weight':
        return tdee - 500; // 500 calorie deficit for ~1 lb/week loss
      case 'gain_weight':
        return tdee + 300; // 300 calorie surplus for lean muscle gain
      case 'maintain_weight':
      default:
        return tdee;
    }
  }

  /**
   * Calculate macronutrient distribution based on diet preference
   */
  static calculateMacros(calories: number, dietPreference: string, goal: string): {
    protein: number;
    carbs: number;
    fats: number;
  } {
    let proteinPercent: number;
    let fatPercent: number;
    let carbPercent: number;

    // Base macronutrient ratios by diet type
    switch (dietPreference) {
      case 'vegan':
        proteinPercent = goal === 'gain_weight' ? 0.18 : 0.15; // 15-18% protein
        fatPercent = 0.25; // 25% fat
        carbPercent = 1 - proteinPercent - fatPercent; // Remaining carbs
        break;
      
      case 'vegetarian':
        proteinPercent = goal === 'gain_weight' ? 0.20 : 0.17; // 17-20% protein
        fatPercent = 0.27; // 27% fat
        carbPercent = 1 - proteinPercent - fatPercent;
        break;
      
      case 'pescatarian':
        proteinPercent = goal === 'gain_weight' ? 0.25 : 0.20; // 20-25% protein
        fatPercent = 0.30; // 30% fat (includes omega-3 rich fish)
        carbPercent = 1 - proteinPercent - fatPercent;
        break;
      
      case 'classic':
      default:
        proteinPercent = goal === 'gain_weight' ? 0.30 : 0.25; // 25-30% protein
        fatPercent = 0.25; // 25% fat
        carbPercent = 1 - proteinPercent - fatPercent;
        break;
    }

    // Adjust for weight loss (higher protein to preserve muscle)
    if (goal === 'lose_weight') {
      proteinPercent = Math.min(proteinPercent + 0.05, 0.35); // Increase protein by 5%, max 35%
      fatPercent = Math.max(fatPercent - 0.03, 0.20); // Decrease fat slightly, min 20%
      carbPercent = 1 - proteinPercent - fatPercent;
    }

    // Convert percentages to grams
    const proteinCalories = calories * proteinPercent;
    const fatCalories = calories * fatPercent;
    const carbCalories = calories * carbPercent;

    return {
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      carbs: Math.round(carbCalories / 4), // 4 calories per gram
      fats: Math.round(fatCalories / 9) // 9 calories per gram
    };
  }

  /**
   * Calculate additional nutrition targets
   */
  static calculateAdditionalNutrition(calories: number, weight: number): {
    fiber: number;
    sugar: number;
    sodium: number;
  } {
    return {
      fiber: Math.max(25, Math.round(calories / 1000 * 14)), // 14g per 1000 calories, min 25g
      sugar: Math.round(calories * 0.10 / 4), // Max 10% of calories from added sugar
      sodium: Math.min(2300, Math.round(weight * 15)) // Max 2300mg, or 15mg per kg body weight
    };
  }

  /**
   * Main function to calculate complete nutrition goals
   */
  static calculateNutritionGoals(profile: UserProfileData): NutritionGoals {
    // Step 1: Calculate BMR
    const bmr = this.calculateBMR(profile.gender, profile.age, profile.weight, profile.height);
    
    // Step 2: Calculate TDEE
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    
    // Step 3: Adjust for goal
    const dailyCalories = this.adjustCaloriesForGoal(tdee, profile.goal);
    
    // Step 4: Calculate macros
    const macros = this.calculateMacros(dailyCalories, profile.dietPreference, profile.goal);
    
    // Step 5: Calculate additional nutrition
    const additional = this.calculateAdditionalNutrition(dailyCalories, profile.weight);

    return {
      dailyCalories: Math.round(dailyCalories),
      protein: macros.protein,
      carbs: macros.carbs,
      fats: macros.fats,
      fiber: additional.fiber,
      sugar: additional.sugar,
      sodium: additional.sodium
    };
  }

  /**
   * Get diet-specific recommendations and tips
   */
  static getDietRecommendations(dietPreference: string): {
    proteinSources: string[];
    tips: string[];
    considerations: string[];
  } {
    switch (dietPreference) {
      case 'vegan':
        return {
          proteinSources: [
            'Legumes (lentils, chickpeas, black beans)',
            'Quinoa and other whole grains',
            'Nuts and seeds (hemp, chia, pumpkin)',
            'Tofu, tempeh, and seitan',
            'Nutritional yeast',
            'Plant-based protein powders'
          ],
          tips: [
            'Combine different protein sources throughout the day',
            'Focus on B12, iron, and omega-3 supplementation',
            'Include vitamin C with iron-rich foods for better absorption'
          ],
          considerations: [
            'May need higher protein intake due to lower bioavailability',
            'Ensure adequate B12, vitamin D, and omega-3 fatty acids',
            'Monitor iron and zinc levels'
          ]
        };
      
      case 'vegetarian':
        return {
          proteinSources: [
            'Eggs and dairy products',
            'Greek yogurt and cottage cheese',
            'Legumes and beans',
            'Quinoa and whole grains',
            'Nuts and seeds',
            'Plant-based proteins'
          ],
          tips: [
            'Include eggs and dairy for complete proteins',
            'Vary protein sources throughout the week',
            'Consider omega-3 supplements if not eating fish'
          ],
          considerations: [
            'Easier to meet protein needs than vegan diet',
            'Monitor B12 and iron intake',
            'Include variety of colorful vegetables'
          ]
        };
      
      case 'pescatarian':
        return {
          proteinSources: [
            'Fish and seafood (salmon, tuna, sardines)',
            'Eggs and dairy products',
            'Legumes and beans',
            'Quinoa and whole grains',
            'Nuts and seeds'
          ],
          tips: [
            'Include fatty fish 2-3 times per week for omega-3s',
            'Choose low-mercury fish options',
            'Vary between fish and plant proteins'
          ],
          considerations: [
            'Excellent source of omega-3 fatty acids',
            'Generally easier to meet all nutrient needs',
            'Be mindful of mercury in larger fish'
          ]
        };
      
      case 'classic':
      default:
        return {
          proteinSources: [
            'Lean meats (chicken, turkey, lean beef)',
            'Fish and seafood',
            'Eggs and dairy products',
            'Legumes and beans',
            'Nuts and seeds'
          ],
          tips: [
            'Choose lean cuts of meat',
            'Include fish 2-3 times per week',
            'Balance animal and plant proteins'
          ],
          considerations: [
            'Easiest to meet all macronutrient needs',
            'Focus on lean protein sources',
            'Include plenty of vegetables and whole grains'
          ]
        };
    }
  }

  /**
   * Convert pounds to kilograms
   */
  static poundsToKg(pounds: number): number {
    return pounds * 0.453592;
  }

  /**
   * Convert feet/inches to centimeters
   */
  static feetInchesToCm(feet: number, inches: number): number {
    return (feet * 12 + inches) * 2.54;
  }
}
