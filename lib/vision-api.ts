// Google Cloud Vision API REST client for React Native/Expo
// Using REST API instead of Node.js client library for compatibility

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
  }

  /**
   * Convert image URI to base64 string
   */
  private async imageUriToBase64(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to convert image to base64: ${error}`);
    }
  }

  /**
   * Analyze image using Google Cloud Vision API
   */
  async analyzeImage(imageUri: string): Promise<VisionApiResponse> {
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
                maxResults: 20
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 10
              }
            ]
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        let errorMessage = `Vision API request failed: ${response.status}`;
        
        if (response.status === 403) {
          errorMessage += ' - API key may not have Vision API enabled or billing not set up';
        } else if (response.status === 400) {
          errorMessage += ' - Invalid request format';
        } else if (response.status === 429) {
          errorMessage += ' - Rate limit exceeded';
        }
        
        // Only log detailed errors for non-403 errors (403 is expected when API not set up)
        if (response.status !== 403) {
          console.error('Vision API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText
          });
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.responses && data.responses[0]) {
        return data.responses[0];
      } else {
        throw new Error('Invalid response format from Vision API');
      }
    } catch (error) {
      // Re-throw error for handling at higher level
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

    // Food-related keywords to filter labels
    const foodKeywords = [
      'food', 'dish', 'meal', 'cuisine', 'ingredient', 'fruit', 'vegetable',
      'meat', 'bread', 'pasta', 'rice', 'chicken', 'beef', 'fish', 'seafood',
      'dairy', 'cheese', 'milk', 'egg', 'breakfast', 'lunch', 'dinner',
      'snack', 'dessert', 'cake', 'pizza', 'burger', 'sandwich', 'salad',
      'soup', 'beverage', 'drink', 'coffee', 'tea', 'juice', 'smoothie',
      // Add specific fruits and vegetables
      'apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grapes',
      'broccoli', 'carrot', 'spinach', 'tomato', 'lettuce', 'potato',
      // Add more specific food items
      'natural foods', 'plant', 'produce', 'fresh', 'organic'
    ];

    return visionResponse.labelAnnotations
      .filter(label => {
        const description = label.description.toLowerCase();
        return foodKeywords.some(keyword => 
          description.includes(keyword) || 
          label.score > 0.7 // High confidence labels
        );
      })
      .sort((a, b) => b.score - a.score) // Sort by confidence
      .slice(0, 10) // Take top 10
      .map(label => label.description);
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
