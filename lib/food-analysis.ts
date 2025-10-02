import VisionApiSimple from './vision-api-simple';

export interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
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
}

// Nutrition database for common foods (calories per 100g)
const NUTRITION_DATABASE: Record<string, NutritionData & { category: string }> = {
  // Fruits
  'apple': { calories: 52, carbs: 14, protein: 0.3, fats: 0.2, category: 'Fruit' },
  'banana': { calories: 89, carbs: 23, protein: 1.1, fats: 0.3, category: 'Fruit' },
  'orange': { calories: 47, carbs: 12, protein: 0.9, fats: 0.1, category: 'Fruit' },
  'strawberry': { calories: 32, carbs: 8, protein: 0.7, fats: 0.3, category: 'Fruit' },
  'blueberry': { calories: 57, carbs: 14, protein: 0.7, fats: 0.3, category: 'Fruit' },
  'grapes': { calories: 62, carbs: 16, protein: 0.6, fats: 0.2, category: 'Fruit' },
  
  // Vegetables
  'broccoli': { calories: 34, carbs: 7, protein: 2.8, fats: 0.4, category: 'Vegetable' },
  'carrot': { calories: 41, carbs: 10, protein: 0.9, fats: 0.2, category: 'Vegetable' },
  'spinach': { calories: 23, carbs: 4, protein: 2.9, fats: 0.4, category: 'Vegetable' },
  'tomato': { calories: 18, carbs: 4, protein: 0.9, fats: 0.2, category: 'Vegetable' },
  'lettuce': { calories: 15, carbs: 3, protein: 1.4, fats: 0.2, category: 'Vegetable' },
  
  // Grains & Starches
  'rice': { calories: 130, carbs: 28, protein: 2.7, fats: 0.3, category: 'Grain' },
  'bread': { calories: 265, carbs: 49, protein: 9, fats: 3.2, category: 'Grain' },
  'pasta': { calories: 131, carbs: 25, protein: 5, fats: 1.1, category: 'Grain' },
  'potato': { calories: 77, carbs: 17, protein: 2, fats: 0.1, category: 'Vegetable' },
  'oats': { calories: 389, carbs: 66, protein: 17, fats: 7, category: 'Grain' },
  
  // Proteins
  'chicken': { calories: 239, carbs: 0, protein: 27, fats: 14, category: 'Protein' },
  'beef': { calories: 250, carbs: 0, protein: 26, fats: 15, category: 'Protein' },
  'fish': { calories: 206, carbs: 0, protein: 22, fats: 12, category: 'Protein' },
  'egg': { calories: 155, carbs: 1.1, protein: 13, fats: 11, category: 'Protein' },
  'salmon': { calories: 208, carbs: 0, protein: 20, fats: 13, category: 'Protein' },
  
  // Dairy
  'milk': { calories: 42, carbs: 5, protein: 3.4, fats: 1, category: 'Dairy' },
  'cheese': { calories: 113, carbs: 1, protein: 7, fats: 9, category: 'Dairy' },
  'yogurt': { calories: 59, carbs: 3.6, protein: 10, fats: 0.4, category: 'Dairy' },
  
  // Common dishes
  'pizza': { calories: 266, carbs: 33, protein: 11, fats: 10, category: 'Fast Food' },
  'burger': { calories: 295, carbs: 31, protein: 17, fats: 14, category: 'Fast Food' },
  'sandwich': { calories: 200, carbs: 25, protein: 12, fats: 6, category: 'Meal' },
  'salad': { calories: 33, carbs: 6, protein: 3, fats: 0.3, category: 'Meal' },
  'soup': { calories: 56, carbs: 8, protein: 3, fats: 1.5, category: 'Meal' },
  'pancake': { calories: 227, carbs: 28, protein: 6, fats: 9, category: 'Breakfast' },
  'waffle': { calories: 291, carbs: 33, protein: 6, fats: 15, category: 'Breakfast' },
  'cereal': { calories: 379, carbs: 84, protein: 8, fats: 2.4, category: 'Breakfast' },
  
  // Snacks & Desserts
  'cake': { calories: 257, carbs: 46, protein: 3, fats: 7, category: 'Dessert' },
  'chocolate': { calories: 546, carbs: 61, protein: 4.9, fats: 31, category: 'Dessert' },
  'ice cream': { calories: 207, carbs: 24, protein: 3.5, fats: 11, category: 'Dessert' },
  
  // Beverages
  'coffee': { calories: 2, carbs: 0, protein: 0.3, fats: 0, category: 'Beverage' },
};

export class FoodAnalysisService {
  private visionService: VisionApiSimple;
  
  constructor(apiKey: string) {
    this.visionService = new VisionApiSimple();
  }

  /**
   * Analyze food image and return nutrition information
   */
  async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    try {
      // Get Vision API analysis
      const visionResponse = await this.visionService.analyzeImage(imageUri);
      
      // Extract food labels
      const foodLabels = this.visionService.extractFoodLabels(visionResponse);
      
      // Determine confidence based on label scores
      const confidence = this.calculateConfidence(visionResponse);
      
      // If no food detected or confidence is too low, return unknown food with zeros
      if (foodLabels.length === 0 || confidence < 0.2) {
        return this.getUnknownFoodResult(confidence);
      }

      // Find the best matching food item
      const primaryFood = this.findBestFoodMatch(foodLabels);
      
      // If no matching food found in our database, return unknown food with zeros
      if (!primaryFood) {
        return this.getUnknownFoodResult(confidence);
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
        confidence
      };
    } catch (error) {
      // Return unknown food result for any errors
      return this.getUnknownFoodResult(0.1);
    }
  }

  /**
   * Find the best matching food item from detected labels
   */
  private findBestFoodMatch(labels: string[]): (NutritionData & { category: string }) | null {
    console.log('🔍 Looking for food matches in labels:', labels);
    
    for (const label of labels) {
      const normalizedLabel = label.toLowerCase().trim();
      console.log('🔍 Checking label:', normalizedLabel);
      
      // Direct match
      if (NUTRITION_DATABASE[normalizedLabel]) {
        console.log('✅ Direct match found:', normalizedLabel);
        return NUTRITION_DATABASE[normalizedLabel];
      }
      
      // Partial match - check if label contains food name or vice versa
      for (const [food, data] of Object.entries(NUTRITION_DATABASE)) {
        if (normalizedLabel.includes(food) || food.includes(normalizedLabel)) {
          console.log('✅ Partial match found:', food, 'for label:', normalizedLabel);
          return data;
        }
      }
      
      // Special handling for common variations
      const foodVariations: Record<string, string> = {
        'red apple': 'apple',
        'green apple': 'apple',
        'fresh apple': 'apple',
        'ripe banana': 'banana',
        'yellow banana': 'banana',
        'fresh banana': 'banana',
        'cherry tomato': 'tomato',
        'roma tomato': 'tomato',
        'beef steak': 'beef',
        'chicken breast': 'chicken',
        'grilled chicken': 'chicken',
        'white rice': 'rice',
        'brown rice': 'rice',
        'steamed rice': 'rice'
      };
      
      for (const [variation, baseFood] of Object.entries(foodVariations)) {
        if (normalizedLabel.includes(variation) && NUTRITION_DATABASE[baseFood]) {
          console.log('✅ Variation match found:', baseFood, 'for variation:', variation);
          return NUTRITION_DATABASE[baseFood];
        }
      }
    }
    
    console.log('❌ No food matches found');
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
      .slice(0, 5) // Take top 5 labels
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
    
    // Try to create a compound name from multiple labels
    const relevantLabels = labels.slice(0, 3);
    
    if (relevantLabels.length === 1) {
      return this.capitalizeWords(relevantLabels[0]);
    }
    
    // Create compound name
    const mainFood = relevantLabels[0];
    const modifiers = relevantLabels.slice(1);
    
    return this.capitalizeWords(`${mainFood} with ${modifiers.join(' & ')}`);
  }

  /**
   * Calculate health score based on nutrition profile
   */
  private calculateHealthScore(nutrition: NutritionData, labels: string[]): number {
    let score = 5; // Base score
    
    // Bonus for vegetables and fruits
    const healthyKeywords = ['vegetable', 'fruit', 'salad', 'broccoli', 'spinach', 'apple', 'banana'];
    const hasHealthyIngredients = labels.some(label => 
      healthyKeywords.some(keyword => label.toLowerCase().includes(keyword))
    );
    
    if (hasHealthyIngredients) score += 2;
    
    // Penalty for high fats
    if (nutrition.fats > 20) score -= 1;
    
    // Bonus for high protein
    if (nutrition.protein > 15) score += 1;
    
    // Penalty for processed foods
    const processedKeywords = ['pizza', 'burger', 'fries', 'soda', 'candy', 'cookie'];
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

  /**
   * Get result for unknown food items with zero nutrition values
   */
  private getUnknownFoodResult(confidence: number): FoodAnalysisResult {
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
      confidence: Math.max(0.1, confidence)
    };
  }

  /**
   * Get fallback result when analysis fails (deprecated - use getUnknownFoodResult)
   */
  private getFallbackResult(): FoodAnalysisResult {
    return this.getUnknownFoodResult(0.3);
  }
}

export default FoodAnalysisService;
