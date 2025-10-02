// Fixed Google Cloud Vision API REST client for React Native/Expo
import * as FileSystem from 'expo-file-system/legacy';

interface VisionApiResponse {
  labelAnnotations?: Array<{
    description: string;
    score: number;
    confidence: number;
  }>;
  textAnnotations?: Array<{
    description: string;
    boundingPoly: any;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

export class VisionApiService {
  private apiKey: string;
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('🔑 Vision API initialized with key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NO KEY');
  }

  /**
   * Convert image URI to base64 string (React Native compatible)
   */
  private async imageUriToBase64(uri: string): Promise<string> {
    try {
      console.log('📸 Converting image to base64:', uri);
      
      // For test/placeholder images, skip conversion
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        console.log('⚠️ Skipping web URL image for now');
        // For web URLs, we'll use a test image
        return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      }
      
      // For local file URIs (from camera) - Use legacy FileSystem API
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('✅ Image converted to base64, length:', base64.length);
      return base64;
    } catch (error) {
      console.error('❌ Failed to convert image to base64:', error);
      throw new Error(`Failed to convert image to base64: ${error}`);
    }
  }

  /**
   * Analyze image using Google Cloud Vision API
   */
  async analyzeImage(imageUri: string): Promise<VisionApiResponse> {
    console.log('🔍 Starting Vision API analysis for:', imageUri);
    
    try {
      const base64Image = await this.imageUriToBase64(imageUri);
      
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 30  // Increased for better detection
              },
              {
                type: 'OBJECT_LOCALIZATION',  // Added for better food detection
                maxResults: 10
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 10
              }
            ]
          }
        ]
      };

      console.log('📤 Sending request to Vision API...');
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Vision API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Vision API Error:', response.status, errorText);
        
        let errorMessage = `Vision API request failed: ${response.status}`;
        let userMessage = '';
        
        if (response.status === 403) {
          errorMessage = 'Vision API Error: 403 - Permission denied';
          userMessage = 'Vision API not enabled or billing not set up. Please:\n' +
                       '1. Go to Google Cloud Console\n' +
                       '2. Enable Vision API for your project\n' +
                       '3. Ensure billing is activated\n' +
                       '4. Check ENABLE_VISION_API.md for detailed steps';
        } else if (response.status === 401) {
          errorMessage = 'Vision API Error: 401 - Invalid API key';
          userMessage = 'Invalid API key. Please check your .env file';
        } else if (response.status === 400) {
          errorMessage = 'Vision API Error: 400 - Bad request';
          userMessage = 'Invalid request format';
        } else if (response.status === 429) {
          errorMessage = 'Vision API Error: 429 - Rate limited';
          userMessage = 'Too many requests. Please wait a moment and try again';
        }
        
        console.log('📝 User-friendly message:', userMessage || errorMessage);
        throw new Error(userMessage || errorMessage);
      }

      const data = await response.json();
      console.log('📊 Vision API raw response:', JSON.stringify(data, null, 2));
      
      if (data.responses && data.responses[0]) {
        const result = data.responses[0];
        
        // Log detected labels for debugging
        if (result.labelAnnotations) {
          console.log('🏷️ Detected labels:');
          result.labelAnnotations.forEach((label: any, index: number) => {
            console.log(`  ${index + 1}. ${label.description} (${Math.round(label.score * 100)}%)`);
          });
        }
        
        return result;
      } else {
        throw new Error('Invalid response format from Vision API');
      }
    } catch (error) {
      console.error('❌ Vision API Error:', error);
      throw error;
    }
  }

  /**
   * Extract food-related labels from Vision API response
   */
  extractFoodLabels(visionResponse: VisionApiResponse): string[] {
    if (!visionResponse.labelAnnotations) {
      console.log('⚠️ No label annotations found');
      return [];
    }

    // Much more comprehensive food-related keywords
    const foodKeywords = [
      // General food terms
      'food', 'dish', 'meal', 'cuisine', 'ingredient', 'recipe', 'cooking',
      'edible', 'nutrition', 'snack', 'breakfast', 'lunch', 'dinner',
      
      // Fruits (comprehensive list)
      'fruit', 'apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grape',
      'watermelon', 'pineapple', 'mango', 'peach', 'pear', 'cherry', 'plum',
      'kiwi', 'lemon', 'lime', 'grapefruit', 'pomegranate', 'apricot', 'berry',
      'melon', 'cantaloupe', 'honeydew', 'papaya', 'coconut', 'avocado',
      
      // Vegetables
      'vegetable', 'broccoli', 'carrot', 'spinach', 'tomato', 'lettuce', 'potato',
      'onion', 'garlic', 'pepper', 'cucumber', 'celery', 'corn', 'peas', 'bean',
      'cabbage', 'cauliflower', 'zucchini', 'eggplant', 'mushroom', 'asparagus',
      
      // Proteins
      'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'egg', 'tofu',
      'turkey', 'lamb', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage',
      
      // Grains & Carbs
      'bread', 'pasta', 'rice', 'cereal', 'grain', 'wheat', 'oat', 'quinoa',
      'noodle', 'bagel', 'toast', 'croissant', 'muffin', 'pancake', 'waffle',
      
      // Dairy
      'dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream',
      
      // Common dishes
      'pizza', 'burger', 'sandwich', 'salad', 'soup', 'stew', 'curry',
      'sushi', 'taco', 'burrito', 'wrap', 'bowl', 'plate',
      
      // Desserts & Sweets
      'dessert', 'cake', 'cookie', 'chocolate', 'candy', 'sweet', 'sugar',
      'pie', 'donut', 'pastry', 'brownie', 'cupcake',
      
      // Beverages
      'beverage', 'drink', 'coffee', 'tea', 'juice', 'smoothie', 'soda',
      'water', 'wine', 'beer', 'cocktail',
      
      // Food descriptors
      'fresh', 'organic', 'natural', 'raw', 'cooked', 'baked', 'fried',
      'grilled', 'steamed', 'roasted', 'boiled',
      
      // Plant and produce terms
      'plant', 'produce', 'harvest', 'ripe', 'garden'
    ];

    // First, get all labels
    const allLabels = visionResponse.labelAnnotations.map(label => ({
      description: label.description,
      score: label.score
    }));

    console.log('🔍 Filtering food labels from:', allLabels.length, 'total labels');

    // Filter for food-related labels
    const foodLabels = visionResponse.labelAnnotations
      .filter(label => {
        const description = label.description.toLowerCase();
        
        // Check if it's a food keyword
        const isFood = foodKeywords.some(keyword => {
          // Check for exact match or contains
          return description === keyword || 
                 description.includes(keyword) || 
                 keyword.includes(description);
        });
        
        // Also include high-confidence labels that might be food
        const highConfidence = label.score > 0.8;
        
        if (isFood || highConfidence) {
          console.log(`  ✅ Food label: ${label.description} (${Math.round(label.score * 100)}%)`);
        }
        
        return isFood || highConfidence;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)  // Take top 15 food labels
      .map(label => label.description);

    console.log('📝 Final food labels:', foodLabels);
    return foodLabels;
  }

  /**
   * Extract text from image (useful for nutrition labels, menus, etc.)
   */
  extractText(visionResponse: VisionApiResponse): string[] {
    if (!visionResponse.textAnnotations || visionResponse.textAnnotations.length === 0) {
      return [];
    }

    // First annotation contains all detected text
    const fullText = visionResponse.textAnnotations[0]?.description || '';
    
    // Split into lines and filter out empty ones
    return fullText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
}

export default VisionApiService;
