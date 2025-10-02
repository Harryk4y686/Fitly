import { FoodAnalysisResult } from './food-analysis';

// Mock food analysis service for when Vision API is not available
export class MockFoodAnalysisService {
  
  /**
   * Analyze food image using mock data based on common food patterns
   */
  async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    console.log('🎭 Mock analysis starting for image:', imageUri);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('🎭 Mock analysis delay completed');
    
    // Generate realistic food analysis based on common foods
    const mockFoods = [
      {
        foodName: 'Fresh Egg',
        category: 'Protein',
        ingredients: [
          { name: 'Whole Egg', calories: 70 }
        ],
        nutrition: { calories: 70, carbs: 1, protein: 6, fats: 5 },
        healthScore: 8
      },
      {
        foodName: 'Boiled Eggs',
        category: 'Protein',
        ingredients: [
          { name: 'Eggs (2 pieces)', calories: 140 }
        ],
        nutrition: { calories: 140, carbs: 1, protein: 12, fats: 10 },
        healthScore: 9
      },
      {
        foodName: 'Apple',
        category: 'Fruit',
        ingredients: [
          { name: 'Fresh Apple', calories: 95 }
        ],
        nutrition: { calories: 95, carbs: 25, protein: 0, fats: 0 },
        healthScore: 10
      },
      {
        foodName: 'Banana',
        category: 'Fruit',
        ingredients: [
          { name: 'Ripe Banana', calories: 105 }
        ],
        nutrition: { calories: 105, carbs: 27, protein: 1, fats: 0 },
        healthScore: 9
      },
      {
        foodName: 'Grilled Chicken Breast',
        category: 'Protein',
        ingredients: [
          { name: 'Chicken Breast', calories: 165 }
        ],
        nutrition: { calories: 165, carbs: 0, protein: 31, fats: 4 },
        healthScore: 9
      },
      {
        foodName: 'White Rice Bowl',
        category: 'Carbs',
        ingredients: [
          { name: 'Steamed Rice', calories: 205 }
        ],
        nutrition: { calories: 205, carbs: 45, protein: 4, fats: 0 },
        healthScore: 6
      },
      {
        foodName: 'Mixed Salad',
        category: 'Vegetable',
        ingredients: [
          { name: 'Lettuce', calories: 10 },
          { name: 'Tomatoes', calories: 20 },
          { name: 'Cucumber', calories: 8 }
        ],
        nutrition: { calories: 38, carbs: 8, protein: 2, fats: 0 },
        healthScore: 10
      },
      {
        foodName: 'Bread Slice',
        category: 'Carbs',
        ingredients: [
          { name: 'White Bread', calories: 80 }
        ],
        nutrition: { calories: 80, carbs: 15, protein: 3, fats: 1 },
        healthScore: 5
      },
      {
        foodName: 'Pasta Dish',
        category: 'Meal',
        ingredients: [
          { name: 'Pasta', calories: 220 },
          { name: 'Sauce', calories: 50 }
        ],
        nutrition: { calories: 270, carbs: 54, protein: 10, fats: 2 },
        healthScore: 6
      },
      {
        foodName: 'Sandwich',
        category: 'Meal',
        ingredients: [
          { name: 'Bread', calories: 160 },
          { name: 'Filling', calories: 120 }
        ],
        nutrition: { calories: 280, carbs: 30, protein: 15, fats: 12 },
        healthScore: 6
      },
      {
        foodName: 'Orange',
        category: 'Fruit',
        ingredients: [
          { name: 'Fresh Orange', calories: 62 }
        ],
        nutrition: { calories: 62, carbs: 15, protein: 1, fats: 0 },
        healthScore: 10
      },
      {
        foodName: 'Yogurt Cup',
        category: 'Dairy',
        ingredients: [
          { name: 'Plain Yogurt', calories: 100 }
        ],
        nutrition: { calories: 100, carbs: 12, protein: 6, fats: 3 },
        healthScore: 8
      }
    ];
    
    // 20% chance to return unknown food item with zeros
    const shouldReturnUnknown = Math.random() < 0.2;
    
    if (shouldReturnUnknown) {
      console.log('🎭 Returning unknown food item with zeros');
      return {
        foodName: 'Unknown Food Item',
        category: 'Food',
        ingredients: [
          { name: 'Mixed Ingredients', calories: 0 }
        ],
        nutrition: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fats: 0
        },
        healthScore: 0,
        confidence: 0.2 + (Math.random() * 0.2) // 20-40% confidence for unknown items
      };
    }
    
    // Randomly select a mock food
    const selectedFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    console.log('🎭 Selected mock food:', selectedFood.foodName);
    
    // Add some variation to make it seem more realistic
    const variation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 multiplier
    
    const result = {
      ...selectedFood,
      nutrition: {
        calories: Math.round(selectedFood.nutrition.calories * variation),
        carbs: Math.round(selectedFood.nutrition.carbs * variation),
        protein: Math.round(selectedFood.nutrition.protein * variation),
        fats: Math.round(selectedFood.nutrition.fats * variation)
      },
      ingredients: selectedFood.ingredients.map(ingredient => ({
        ...ingredient,
        calories: Math.round(ingredient.calories * variation)
      })),
      confidence: 0.75 + (Math.random() * 0.2) // 75-95% confidence
    };

    console.log('🎭 Mock analysis result:', result.foodName, 'Confidence:', Math.round(result.confidence * 100) + '%');
    return result;
  }
}

export default MockFoodAnalysisService;
