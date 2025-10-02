# Google Cloud Vision API Integration

## Overview
Your CalorieSnap app now uses Google Cloud Vision API for real-time food recognition and nutrition analysis. The integration replaces the mock analysis with actual AI-powered food detection.

## Features
- **Real-time Food Detection**: Uses Google Cloud Vision API to identify food items in photos
- **Nutrition Estimation**: Provides calorie, protein, carbs, and fat estimates based on detected foods
- **Ingredient Recognition**: Lists individual ingredients with their calorie contributions
- **Health Scoring**: Calculates a health score (1-10) based on nutritional profile
- **Confidence Scoring**: Shows how confident the AI is about the analysis
- **Error Handling**: Graceful fallback when analysis fails

## How It Works

### 1. Image Capture
- User takes a photo using the camera interface
- Image is captured at 80% quality for optimal processing

### 2. Vision API Analysis
- Image is converted to base64 format
- Sent to Google Cloud Vision API for label detection
- API returns detected objects with confidence scores

### 3. Food Matching
- Detected labels are filtered for food-related items
- Matched against internal nutrition database
- Best matches are used for nutrition calculation

### 4. Results Display
- Shows detected food name and category
- Lists ingredients with individual calorie counts
- Displays comprehensive nutrition information
- Provides health score and confidence rating

## API Configuration

### Environment Variables
The app uses your Google Cloud API key from the `.env` file:
```
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=AIzaSyD370jTmuqx8EoZEpNhmn5FH1BFcbWFmEY
```

### API Endpoints Used
- **Vision API**: `https://vision.googleapis.com/v1/images:annotate`
- **Features**: Label Detection, Text Detection (for nutrition labels)

## Nutrition Database

The app includes a comprehensive nutrition database with:
- **Fruits**: Apple, banana, orange, strawberry, blueberry, grapes
- **Vegetables**: Broccoli, carrot, spinach, tomato, lettuce
- **Grains**: Rice, bread, pasta, potato, oats
- **Proteins**: Chicken, beef, fish, egg, salmon
- **Dairy**: Milk, cheese, yogurt
- **Common Dishes**: Pizza, burger, sandwich, salad, soup, pancakes
- **Snacks & Desserts**: Cookies, cake, chocolate, ice cream
- **Beverages**: Coffee, tea, juice, soda

## Error Handling

### Fallback Mechanisms
1. **API Failure**: Shows estimated nutrition values with error indicator
2. **No Food Detected**: Provides generic food item with average nutrition
3. **Network Issues**: Graceful degradation with user notification

### Error Indicators
- Red warning banner in results screen
- "Analysis failed - showing estimates" message
- Lower confidence scores for fallback results

## Testing the Integration

### Manual Testing
1. Open the app and navigate to the camera tab
2. Take a photo of food (fruits, meals, snacks work best)
3. Wait for analysis (usually 2-5 seconds)
4. Review the detected food name, ingredients, and nutrition info
5. Check the confidence score - higher is better

### Expected Results
- **High Confidence (80%+)**: Clear food photos with good lighting
- **Medium Confidence (50-80%)**: Partially visible or mixed foods
- **Low Confidence (<50%)**: Unclear images or non-food items

## Optimization Tips

### For Better Results
1. **Good Lighting**: Take photos in well-lit environments
2. **Clear Focus**: Ensure food is in focus and clearly visible
3. **Single Items**: Works best with individual food items
4. **Close-up Shots**: Fill the frame with the food item
5. **Avoid Clutter**: Minimize background objects

### Performance Considerations
- Images are compressed to 80% quality for faster upload
- API calls are cached to avoid duplicate requests
- Fallback nutrition data loads instantly if API fails

## Troubleshooting

### Common Issues
1. **"API key not found"**: Check `.env` file configuration
2. **"No food detected"**: Try different lighting or closer shots
3. **Slow analysis**: Check internet connection
4. **Incorrect results**: Food may not be in nutrition database

### Debug Information
- Check console logs for detailed API responses
- Error messages provide specific failure reasons
- Confidence scores indicate analysis reliability

## Future Enhancements

### Planned Features
- Custom nutrition database expansion
- Portion size estimation using object detection
- Barcode scanning for packaged foods
- User feedback system to improve accuracy
- Offline mode with cached nutrition data

### API Upgrades
- Integration with additional nutrition APIs
- Machine learning model fine-tuning
- Real-time streaming analysis
- Multi-language food recognition
