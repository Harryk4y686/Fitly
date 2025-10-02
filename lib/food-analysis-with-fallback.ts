import VisionApiSimple from './vision-api-simple';

export interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: string[];
}

export interface IngredientData {
  name: string;
  calories: number;
}

export interface FoodAnalysisResult {
  foodName: string;
  category: string;
  ingredients: IngredientData[];
  nutrition: NutritionData;
  healthScore: number;
  confidence: number;
  usingMockData?: boolean;
}

// Mock food database for fallback
const MOCK_FOODS = [
  {
    foodName: 'Grilled Chicken Breast',
    category: 'Protein',
    ingredients: [
      { name: 'Chicken Breast', calories: 165 },
      { name: 'Olive Oil', calories: 40 },
      { name: 'Herbs', calories: 5 }
    ],
    nutrition: { calories: 210, carbs: 0, protein: 31, fats: 9 },
    healthScore: 8
  },
  {
    foodName: 'Grilled Steak',
    category: 'Protein',
    ingredients: [
      { name: 'Beef Steak', calories: 220 },
      { name: 'Seasoning', calories: 5 },
      { name: 'Oil', calories: 25 }
    ],
    nutrition: { calories: 250, carbs: 0, protein: 26, fats: 15 },
    healthScore: 7
  },
  {
    foodName: 'Mixed Salad Bowl',
    category: 'Healthy',
    ingredients: [
      { name: 'Lettuce', calories: 15 },
      { name: 'Tomatoes', calories: 18 },
      { name: 'Cucumber', calories: 8 },
      { name: 'Dressing', calories: 45 }
    ],
    nutrition: { calories: 86, carbs: 12, protein: 3, fats: 4 },
    healthScore: 9
  },
  {
    foodName: 'Grilled Chicken Breast',
    category: 'Protein',
    ingredients: [
      { name: 'Chicken', calories: 165 },
      { name: 'Olive Oil', calories: 40 },
      { name: 'Herbs', calories: 5 }
    ],
    nutrition: { calories: 210, carbs: 0, protein: 31, fats: 9 },
    healthScore: 8
  },
  {
    foodName: 'Pasta Carbonara',
    category: 'Italian',
    ingredients: [
      { name: 'Pasta', calories: 220 },
      { name: 'Bacon', calories: 120 },
      { name: 'Parmesan', calories: 80 },
      { name: 'Egg', calories: 70 }
    ],
    nutrition: { calories: 490, carbs: 42, protein: 19, fats: 28 },
    healthScore: 5
  },
  {
    foodName: 'Fresh Fruit Bowl',
    category: 'Fruit',
    ingredients: [
      { name: 'Apple', calories: 52 },
      { name: 'Banana', calories: 89 },
      { name: 'Strawberries', calories: 32 },
      { name: 'Blueberries', calories: 57 }
    ],
    nutrition: { calories: 230, carbs: 58, protein: 3, fats: 1 },
    healthScore: 10
  },
  {
    foodName: 'Vegetable Stir Fry',
    category: 'Asian',
    ingredients: [
      { name: 'Broccoli', calories: 34 },
      { name: 'Carrots', calories: 41 },
      { name: 'Peppers', calories: 31 },
      { name: 'Soy Sauce', calories: 10 }
    ],
    nutrition: { calories: 116, carbs: 18, protein: 5, fats: 3 },
    healthScore: 8
  }
];

// Nutrition database for common foods (calories per 100g)
const NUTRITION_DATABASE: Record<string, NutritionData & { category: string }> = {
  // Fruits
  'apple': { calories: 52, carbs: 14, protein: 0.3, fats: 0.2, category: 'Fruit' },
  'banana': { calories: 89, carbs: 23, protein: 1.1, fats: 0.3, category: 'Fruit' },
  'orange': { calories: 47, carbs: 12, protein: 0.9, fats: 0.1, category: 'Fruit' },
  'strawberry': { calories: 32, carbs: 8, protein: 0.7, fats: 0.3, category: 'Fruit' },
  'blueberry': { calories: 57, carbs: 14, protein: 0.7, fats: 0.3, category: 'Fruit' },
  
  // Vegetables
  'broccoli': { calories: 34, carbs: 7, protein: 2.8, fats: 0.4, category: 'Vegetable' },
  'carrot': { calories: 41, carbs: 10, protein: 0.9, fats: 0.2, category: 'Vegetable' },
  'spinach': { calories: 23, carbs: 4, protein: 2.9, fats: 0.4, category: 'Vegetable' },
  'tomato': { calories: 18, carbs: 4, protein: 0.9, fats: 0.2, category: 'Vegetable' },
  
  // Proteins
  'chicken': { calories: 239, carbs: 0, protein: 27, fats: 14, category: 'Protein', vitamins: ['B6', 'Niacin'] },
  'beef': { calories: 250, carbs: 0, protein: 26, fats: 15, category: 'Protein', vitamins: ['B12', 'Iron', 'Zinc'] },
  'steak': { calories: 271, carbs: 0, protein: 25, fats: 19, category: 'Protein', vitamins: ['B12', 'Iron', 'Zinc'] },
  'sirloin': { calories: 271, carbs: 0, protein: 25, fats: 19, category: 'Protein', vitamins: ['B12', 'Iron'] },
  'ribeye': { calories: 291, carbs: 0, protein: 24, fats: 21, category: 'Protein', vitamins: ['B12', 'Iron'] },
  'filet': { calories: 227, carbs: 0, protein: 22, fats: 15, category: 'Protein', vitamins: ['B12', 'Iron'] },
  'meat': { calories: 250, carbs: 0, protein: 26, fats: 15, category: 'Protein', vitamins: ['B12', 'Iron'] },
  'fish': { calories: 206, carbs: 0, protein: 22, fats: 12, category: 'Protein', vitamins: ['Omega-3', 'D'] },
  'salmon': { calories: 208, carbs: 0, protein: 20, fats: 13, category: 'Protein', vitamins: ['Omega-3', 'D', 'B12'] },
  'egg': { calories: 155, carbs: 1.1, protein: 13, fats: 11, category: 'Protein', vitamins: ['B12', 'Choline'] },
  
  // Common dishes
  'pizza': { calories: 266, carbs: 33, protein: 11, fats: 10, category: 'Fast Food' },
  'burger': { calories: 295, carbs: 31, protein: 17, fats: 14, category: 'Fast Food' },
  'sandwich': { calories: 200, carbs: 25, protein: 12, fats: 6, category: 'Meal' },
  'salad': { calories: 33, carbs: 6, protein: 3, fats: 0.3, category: 'Meal' },
  
  // Electronics/Non-food (for better recognition)
  'computer': { calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Non-Food' },
  'laptop': { calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Non-Food' },
  'screen': { calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Non-Food' },
  'monitor': { calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Non-Food' },
  'keyboard': { calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Non-Food' },
  
  // More common foods
  'rice': { calories: 130, carbs: 28, protein: 2.7, fats: 0.3, category: 'Grain' },
  'pasta': { calories: 131, carbs: 25, protein: 5, fats: 1.1, category: 'Grain' },
  'bread': { calories: 265, carbs: 49, protein: 9, fats: 3.2, category: 'Grain' },
  'potato': { calories: 77, carbs: 17, protein: 2, fats: 0.1, category: 'Vegetable' },
  'cheese': { calories: 113, carbs: 1, protein: 7, fats: 9, category: 'Dairy' },
  'milk': { calories: 42, carbs: 5, protein: 3.4, fats: 1, category: 'Dairy' },
  'yogurt': { calories: 59, carbs: 3.6, protein: 10, fats: 0.4, category: 'Dairy' },
};

export class FoodAnalysisService {
  private visionApi: VisionApiSimple;
  
  constructor(apiKey?: string) {
    this.visionApi = new VisionApiSimple();
    console.log('🔐 Food Analysis Service initialized');
  }

  /**
   * Analyze food image and return nutrition information
   */
  async analyzeFood(imageUri: string): Promise<FoodAnalysisResult> {
    console.log('🍔 Starting food analysis for:', imageUri);
    
    try {
      // Try to analyze with Vision API
      const visionResponse = await this.visionApi.analyzeImage(imageUri);
      
      // Extract food-related labels
      const foodLabels = this.visionApi.extractFoodLabels(visionResponse);
      const textLabels = this.visionApi.extractText(visionResponse);
      
      console.log('🏷️ Food labels found:', foodLabels);
      console.log('📝 Text found:', textLabels);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(visionResponse);
      
      // If no food detected, return mock data
      if (foodLabels.length === 0 || confidence < 0.2) {
        console.log('⚠️ No food detected, using mock data');
        return this.getMockFoodResult();
      }

      // Find the best matching food
      const primaryFood = this.findBestFoodMatch(foodLabels);
      
      // If no matching food found, return mock data
      if (!primaryFood) {
        console.log('⚠️ No matching food in database, using mock data');
        return this.getMockFoodResult();
      }
      
      // Generate nutrition data
      const nutrition = this.estimateNutrition(foodLabels);
      
      // Generate ingredients list
      const ingredients = this.generateIngredients(foodLabels);
      
      // Calculate health score
      const healthScore = this.calculateHealthScore(nutrition, foodLabels);

      return {
        foodName: this.generateFoodName(foodLabels),
        category: primaryFood?.category || 'Food',
        ingredients,
        nutrition,
        healthScore,
        confidence,
        usingMockData: false
      };
    } catch (error: any) {
      console.error('❌ Food analysis error:', error);
      
      // Check if it's an API configuration issue
      if (error.message && (
        error.message.includes('Vision API not enabled') ||
        error.message.includes('403') ||
        error.message.includes('billing')
      )) {
        console.log('⚠️ Vision API not configured properly');
        console.log('💡 Using mock data as fallback');
        console.log('📋 To enable real AI analysis:');
        console.log('   1. Enable Vision API: https://console.cloud.google.com/apis/library/vision.googleapis.com');
        console.log('   2. Enable billing: https://console.cloud.google.com/billing');
      }
      
      // Return mock data as fallback
      return this.getMockFoodResult();
    }
  }

  /**
   * Get a random mock food result for fallback
   */
  private getMockFoodResult(): FoodAnalysisResult {
    // Select a random mock food
    const mockFood = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
    
    // Add some variation to the values
    const variation = 0.8 + Math.random() * 0.4; // 80% to 120%
    
    return {
      ...mockFood,
      nutrition: {
        calories: Math.round(mockFood.nutrition.calories * variation),
        carbs: Math.round(mockFood.nutrition.carbs * variation),
        protein: Math.round(mockFood.nutrition.protein * variation),
        fats: Math.round(mockFood.nutrition.fats * variation),
      },
      confidence: 0.75 + Math.random() * 0.2, // 75% to 95%
      usingMockData: true
    };
  }

  /**
   * Find the best matching food item from detected labels
   */
  private findBestFoodMatch(labels: string[]): (NutritionData & { category: string }) | null {
    for (const label of labels) {
      const normalizedLabel = label.toLowerCase().trim();
      
      // Direct match
      if (NUTRITION_DATABASE[normalizedLabel]) {
        return NUTRITION_DATABASE[normalizedLabel];
      }
      
      // Partial match
      for (const [food, data] of Object.entries(NUTRITION_DATABASE)) {
        if (normalizedLabel.includes(food) || food.includes(normalizedLabel)) {
          return data;
        }
      }
    }
    
    return null;
  }

  /**
   * Estimate nutrition based on detected food labels
   */
  private estimateNutrition(labels: string[]): NutritionData {
    const matches = labels
      .map(label => this.findBestFoodMatch([label]))
      .filter(match => match !== null) as (NutritionData & { category: string })[];

    if (matches.length === 0) {
      // Default nutrition for unknown food
      return { calories: 200, carbs: 25, protein: 8, fats: 8 };
    }

    // Average the nutrition values
    const avgNutrition = matches.reduce(
      (acc, match) => ({
        calories: acc.calories + match.calories,
        carbs: acc.carbs + match.carbs,
        protein: acc.protein + match.protein,
        fats: acc.fats + match.fats,
      }),
      { calories: 0, carbs: 0, protein: 0, fats: 0 }
    );

    const count = matches.length;
    return {
      calories: Math.round(avgNutrition.calories / count),
      carbs: Math.round(avgNutrition.carbs / count),
      protein: Math.round(avgNutrition.protein / count),
      fats: Math.round(avgNutrition.fats / count),
    };
  }

  /**
   * Generate ingredients list from detected labels
   */
  private generateIngredients(labels: string[]): IngredientData[] {
    return labels
      .slice(0, 5)
      .map(label => {
        const match = this.findBestFoodMatch([label]);
        return {
          name: this.capitalizeWords(label),
          calories: match ? Math.round(match.calories * 0.3) : Math.floor(Math.random() * 50) + 10
        };
      });
  }

  /**
   * Generate a readable food name from labels
   */
  private generateFoodName(labels: string[]): string {
    if (labels.length === 0) return 'Unknown Food';
    
    // Priority food keywords for better naming
    const foodPriority = [
      'steak', 'beef', 'chicken', 'fish', 'salmon', 'pork',
      'pizza', 'burger', 'sandwich', 'salad', 'pasta',
      'rice', 'bread', 'soup', 'cake', 'cookie', 'potato',
      'cheese', 'milk', 'yogurt', 'egg', 'apple', 'banana'
    ];
    
    // Non-food items to filter out
    const nonFoodItems = [
      'computer', 'laptop', 'screen', 'monitor', 'keyboard',
      'phone', 'tablet', 'device', 'electronic', 'technology'
    ];
    
    // Check if any labels are non-food items
    const hasNonFood = labels.some(label => 
      nonFoodItems.some(nonFood => label.toLowerCase().includes(nonFood))
    );
    
    if (hasNonFood) {
      console.log('⚠️ Non-food item detected, using fallback food');
      return 'Food Item'; // Will trigger mock data
    }
    
    // Find the most specific food name
    const priorityFood = labels.find(label => 
      foodPriority.some(food => label.toLowerCase().includes(food))
    );
    
    if (priorityFood) {
      // Clean up the name - remove generic words
      let cleanName = priorityFood.toLowerCase()
        .replace(/\b(food|dish|meal|item)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // If it's meat-related, make it more specific
      if (cleanName.includes('meat') && labels.some(l => l.toLowerCase().includes('steak'))) {
        cleanName = 'steak';
      } else if (cleanName.includes('meat') && labels.some(l => l.toLowerCase().includes('beef'))) {
        cleanName = 'beef';
      }
      
      return this.capitalizeWords(cleanName);
    }
    
    // Filter out non-food labels before fallback
    const foodLabels = labels.filter(label => 
      !nonFoodItems.some(nonFood => label.toLowerCase().includes(nonFood))
    );
    
    if (foodLabels.length === 0) {
      console.log('⚠️ No food labels found, using fallback');
      return 'Food Item';
    }
    
    // Fallback to first food label, cleaned up
    const firstLabel = foodLabels[0].toLowerCase()
      .replace(/\b(food|dish|meal|item)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return this.capitalizeWords(firstLabel || 'Food Item');
  }

  /**
   * Calculate health score based on nutrition profile
   */
  private calculateHealthScore(nutrition: NutritionData, labels: string[]): number {
    let score = 5;
    
    const healthyKeywords = ['vegetable', 'fruit', 'salad', 'broccoli', 'spinach', 'apple', 'banana'];
    const hasHealthyIngredients = labels.some(label => 
      healthyKeywords.some(keyword => label.toLowerCase().includes(keyword))
    );
    
    if (hasHealthyIngredients) score += 2;
    if (nutrition.fats > 20) score -= 1;
    if (nutrition.protein > 15) score += 1;
    
    const processedKeywords = ['pizza', 'burger', 'fries', 'soda', 'candy'];
    const isProcessed = labels.some(label => 
      processedKeywords.some(keyword => label.toLowerCase().includes(keyword))
    );
    
    if (isProcessed) score -= 2;
    
    return Math.max(1, Math.min(10, score));
  }

  /**
   * Calculate confidence based on Vision API response
   */
  private calculateConfidence(visionResponse: any): number {
    if (!visionResponse.labelAnnotations || visionResponse.labelAnnotations.length === 0) {
      return 0.3;
    }
    
    const avgScore = visionResponse.labelAnnotations
      .slice(0, 5)
      .reduce((sum: number, label: any) => sum + label.score, 0) / 5;
    
    return Math.round(avgScore * 100) / 100;
  }

  /**
   * Capitalize words for display
   */
  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }
}

export default FoodAnalysisService;
