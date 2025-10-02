# Nutrition Calculator Examples

This document shows how the nutrition calculator works for different user profiles.

## Example 1: Male, Vegan, Weight Maintenance

**Profile:**
- Gender: Male
- Age: 28 years
- Weight: 70 kg (154 lbs)
- Height: 175 cm (5'9")
- Activity Level: Moderate (3-5 days/week exercise)
- Goal: Maintain weight
- Diet: Vegan

**Calculations:**
1. **BMR (Basal Metabolic Rate):** 1,693 kcal/day
   - Formula: 10 × 70 + 6.25 × 175 - 5 × 28 + 5 = 1,693
2. **TDEE (Total Daily Energy Expenditure):** 2,624 kcal/day
   - BMR × 1.55 (moderate activity) = 1,693 × 1.55 = 2,624
3. **Daily Calories:** 2,624 kcal (no adjustment for maintenance)
4. **Macronutrients:**
   - Protein: 15% = 99g (vegan diet, lower bioavailability)
   - Fats: 25% = 73g
   - Carbs: 60% = 394g

**Vegan-Specific Recommendations:**
- Focus on legumes, quinoa, nuts, and seeds for protein
- Combine different protein sources throughout the day
- Consider B12, iron, and omega-3 supplementation

---

## Example 2: Female, Pescatarian, Weight Loss

**Profile:**
- Gender: Female
- Age: 32 years
- Weight: 65 kg (143 lbs)
- Height: 165 cm (5'5")
- Activity Level: Light (1-3 days/week exercise)
- Goal: Lose weight
- Diet: Pescatarian

**Calculations:**
1. **BMR:** 1,401 kcal/day
   - Formula: 10 × 65 + 6.25 × 165 - 5 × 32 - 161 = 1,401
2. **TDEE:** 1,926 kcal/day
   - BMR × 1.375 (light activity) = 1,401 × 1.375 = 1,926
3. **Daily Calories:** 1,426 kcal (500 calorie deficit for weight loss)
4. **Macronutrients:**
   - Protein: 25% = 89g (higher for weight loss + pescatarian)
   - Fats: 27% = 43g (includes omega-3 rich fish)
   - Carbs: 48% = 171g

**Pescatarian-Specific Recommendations:**
- Include fatty fish 2-3 times per week for omega-3s
- Choose low-mercury fish options
- Balance between fish and plant proteins

---

## Example 3: Male, Classic Diet, Muscle Gain

**Profile:**
- Gender: Male
- Age: 25 years
- Weight: 80 kg (176 lbs)
- Height: 180 cm (5'11")
- Activity Level: Very Active (6-7 days/week exercise)
- Goal: Gain weight (muscle)
- Diet: Classic (omnivore)

**Calculations:**
1. **BMR:** 1,885 kcal/day
   - Formula: 10 × 80 + 6.25 × 180 - 5 × 25 + 5 = 1,885
2. **TDEE:** 3,582 kcal/day
   - BMR × 1.9 (very active) = 1,885 × 1.9 = 3,582
3. **Daily Calories:** 3,882 kcal (300 calorie surplus for lean muscle gain)
4. **Macronutrients:**
   - Protein: 30% = 291g (high for muscle building)
   - Fats: 25% = 108g
   - Carbs: 45% = 437g

**Classic Diet Recommendations:**
- Choose lean cuts of meat
- Include fish 2-3 times per week
- Balance animal and plant proteins

---

## Key Features of the Calculator

### 1. **Scientific BMR Calculation**
Uses the Mifflin-St Jeor Equation, which is considered the most accurate for most people:
- **Men:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Women:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

### 2. **Activity Level Multipliers**
- Sedentary (little/no exercise): 1.2
- Light (1-3 days/week): 1.375
- Moderate (3-5 days/week): 1.55
- Active (6-7 days/week): 1.725
- Very Active (very heavy exercise): 1.9

### 3. **Goal-Based Adjustments**
- **Weight Loss:** -500 calories (safe 1 lb/week loss)
- **Maintenance:** No adjustment
- **Weight Gain:** +300 calories (lean muscle gain)

### 4. **Diet-Specific Macro Ratios**

| Diet Type | Protein | Fats | Carbs | Notes |
|-----------|---------|------|-------|-------|
| Vegan | 15-18% | 25% | 57-60% | Higher protein % for muscle gain |
| Vegetarian | 17-20% | 27% | 53-56% | Includes eggs/dairy |
| Pescatarian | 20-25% | 30% | 45-50% | Omega-3 rich fish |
| Classic | 25-30% | 25% | 45-50% | Easiest to meet needs |

### 5. **Additional Nutrition Targets**
- **Fiber:** 14g per 1000 calories (minimum 25g)
- **Sugar:** Maximum 10% of calories from added sugar
- **Sodium:** Maximum 2300mg or 15mg per kg body weight

### 6. **Automatic Adjustments**
- **Weight Loss:** Increases protein by 5% to preserve muscle
- **Muscle Gain:** Increases protein percentage for all diet types
- **Diet Constraints:** Adjusts ratios based on protein availability

## Integration with App

The calculator is fully integrated into the CalorieSnap app:

1. **Onboarding:** Collects all necessary user data
2. **Loading Screen:** Calculates nutrition goals in real-time
3. **Results Screen:** Displays personalized recommendations
4. **Profile Screen:** Shows current goals with ability to edit
5. **Dashboard:** Tracks progress against calculated goals

## Usage Example in Code

```typescript
import { NutritionCalculator } from './lib/nutrition-calculator';

const userProfile = {
  gender: 'male',
  age: 28,
  weight: 70, // kg
  height: 175, // cm
  activityLevel: 'moderate',
  goal: 'maintain_weight',
  dietPreference: 'vegan'
};

const goals = NutritionCalculator.calculateNutritionGoals(userProfile);
console.log(goals);
// Output:
// {
//   dailyCalories: 2624,
//   protein: 99,
//   carbs: 394,
//   fats: 73,
//   fiber: 37,
//   sugar: 66,
//   sodium: 1050
// }
```

This comprehensive system ensures that every user gets personalized, scientifically-based nutrition recommendations tailored to their specific goals, diet preferences, and lifestyle.
