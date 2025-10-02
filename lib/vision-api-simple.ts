// Simple Google Cloud Vision API client using API Key
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

export class VisionApiSimple {
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';
  private apiKey: string;

  constructor() {
    // Use the API key from environment
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY || '';
    console.log('🔑 Vision API initialized with API key');
  }

  /**
   * Convert image URI to base64 string
   */
  private async imageUriToBase64(uri: string): Promise<string> {
    try {
      console.log('📸 Converting image to base64:', uri);
      
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        console.log('⚠️ Skipping web URL image');
        return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      }
      
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
    console.log('🔍 Starting Vision API analysis');
    
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
                maxResults: 30
              },
              {
                type: 'OBJECT_LOCALIZATION',
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
      console.log('🔑 Using API Key:', this.apiKey ? 'API key present' : 'NO API KEY!');
      
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
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = errorJson.error.message || errorMessage;
            console.error('📝 Error details:', errorJson.error);
          }
        } catch (e) {
          // If not JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        if (response.status === 403) {
          console.log('💡 This might be a billing or API enabling issue');
          console.log('💡 Check: https://console.cloud.google.com/apis/library/vision.googleapis.com');
          console.log('💡 And ensure billing is enabled: https://console.cloud.google.com/billing');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📊 Vision API response received');
      
      if (data.responses && data.responses[0]) {
        const result = data.responses[0];
        
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
      return [];
    }

    const foodKeywords = [
      'food', 'dish', 'meal', 'cuisine', 'ingredient', 'recipe', 'cooking',
      'fruit', 'apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grape',
      'vegetable', 'broccoli', 'carrot', 'spinach', 'tomato', 'lettuce', 'potato',
      'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'egg', 'tofu',
      'bread', 'pasta', 'rice', 'cereal', 'grain', 'wheat', 'oat', 'quinoa',
      'dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream',
      'pizza', 'burger', 'sandwich', 'salad', 'soup', 'stew', 'curry',
      'dessert', 'cake', 'cookie', 'chocolate', 'candy', 'sweet', 'sugar',
      'beverage', 'drink', 'coffee', 'tea', 'juice', 'smoothie', 'soda',
      'plant', 'produce', 'harvest', 'ripe', 'garden'
    ];

    const foodLabels = visionResponse.labelAnnotations
      .filter(label => {
        const description = label.description.toLowerCase();
        const isFood = foodKeywords.some(keyword => 
          description === keyword || 
          description.includes(keyword) || 
          keyword.includes(description)
        );
        const highConfidence = label.score > 0.8;
        
        return isFood || highConfidence;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map(label => label.description);

    console.log('📝 Food labels extracted:', foodLabels);
    return foodLabels;
  }

  /**
   * Extract text from image
   */
  extractText(visionResponse: VisionApiResponse): string[] {
    if (!visionResponse.textAnnotations || visionResponse.textAnnotations.length === 0) {
      return [];
    }

    const fullText = visionResponse.textAnnotations[0]?.description || '';
    return fullText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
}

export default VisionApiSimple;
