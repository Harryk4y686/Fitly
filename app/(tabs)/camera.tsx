import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useCalories } from '../../contexts/CalorieContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FoodAnalysisService from '../../lib/food-analysis-with-fallback';

export default function CameraTab() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { addMeal } = useCalories();
  
  // Initialize food analysis services
  const foodAnalysisService = new FoodAnalysisService(
    process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY || ''
  );
  // Removed mockFoodAnalysisService - now using automatic fallback in FoodAnalysisService

  // Test Vision API directly
  const testVisionAPIDirect = async () => {
    console.log('🧪 Testing Vision API directly...');
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;
    
    if (!apiKey) {
      Alert.alert('Error', 'No API key found');
      return;
    }
    
    try {
      // Direct API test - no need for separate VisionApiService
      
      // Test with a simple image
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: testImageBase64 },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }]
          }]
        })
      });
      
      const data = await response.json();
      console.log('✅ Direct Vision API test result:', data);
      
      if (response.ok) {
        Alert.alert('Success', 'Vision API is working!');
      } else {
        Alert.alert('API Error', `Status: ${response.status}\n${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('❌ Direct test failed:', error);
      Alert.alert('Test Failed', String(error));
    }
  };


  const handleTakePhoto = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }

    setShowCamera(true);
  };

  const capturePhoto = async () => {
    console.log('📸 Capture photo button pressed');
    if (cameraRef.current) {
      try {
        console.log('📸 Taking picture...');
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          console.log('📸 Photo captured successfully:', photo.uri);
          setCapturedImage(photo.uri);
          setShowCamera(false);
          analyzeFood(photo.uri);
        } else {
          console.log('❌ No photo returned');
        }
      } catch (error) {
        console.log('❌ Photo capture error:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    } else {
      console.log('❌ Camera ref not available');
    }
  };

  const analyzeFood = async (imageUri: string) => {
    console.log('🔍 Starting food analysis for:', imageUri);
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      // Check if API key is available
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;
      console.log('🔑 API Key available:', !!apiKey);
      console.log('🔑 Full API Key:', apiKey); // Log full key for debugging
      
      let analysisResult;
      let usingMockData = false;
      
      if (!apiKey || apiKey === 'undefined') {
        // No API key - use mock data
        console.log('🎭 No valid API key found, using mock analysis');
        usingMockData = true;
        analysisResult = await foodAnalysisService.analyzeFood(imageUri);
      } else {
        try {
          // Try Vision API first
          console.log('☁️ Attempting Vision API analysis...');
          console.log('📸 Image URI:', imageUri);
          
          analysisResult = await foodAnalysisService.analyzeFood(imageUri);
          
          // Check if we got valid results
          if (analysisResult.foodName === 'Unknown Food Item' && analysisResult.nutrition.calories === 0) {
            console.log('⚠️ Vision API returned unknown food, trying mock data');
            usingMockData = true;
            analysisResult = await foodAnalysisService.analyzeFood(imageUri);
          } else {
            console.log('✅ Vision API success:', analysisResult.foodName);
          }
        } catch (visionError) {
          // Vision API failed - fall back to mock data
          console.error('❌ Vision API error:', visionError);
          console.log('🎭 Falling back to mock analysis');
          usingMockData = true;
          analysisResult = await foodAnalysisService.analyzeFood(imageUri);
        }
      }
      
      // Only log successful real API results
      if (!usingMockData) {
        console.log('Vision API analysis completed:', analysisResult);
      } else {
        console.log('🎭 Mock analysis completed:', analysisResult.foodName);
      }
      
      // Format results for the UI
      const formattedResults = {
        foodName: analysisResult.foodName,
        category: analysisResult.category,
        ingredients: analysisResult.ingredients,
        nutrition: analysisResult.nutrition,
        healthScore: analysisResult.healthScore,
        confidence: analysisResult.confidence,
        usingMockData
      };
      
      console.log('📊 Setting analysis results:', formattedResults.foodName);
      setAnalysisResults(formattedResults);
      setIsAnalyzing(false);
      setShowResults(true);
      
      // Show info if using mock data
      if (usingMockData) {
        setAnalysisError('Using simulated analysis - Vision API not available');
      }
      
    } catch (error) {
      console.error('All food analysis methods failed:', error);
      setIsAnalyzing(false);
      
      // Force use mock analysis as last resort
      try {
        console.log('🚨 Emergency fallback to mock analysis...');
        const emergencyResult = await foodAnalysisService.analyzeFood(imageUri);
        
        const formattedResults = {
          foodName: emergencyResult.foodName,
          category: emergencyResult.category,
          ingredients: emergencyResult.ingredients,
          nutrition: emergencyResult.nutrition,
          healthScore: emergencyResult.healthScore,
          confidence: emergencyResult.confidence,
          usingMockData: true
        };
        
        setAnalysisResults(formattedResults);
        setAnalysisError('Emergency fallback - using simulated analysis');
        setShowResults(true);
        
      } catch (mockError) {
        // Absolute last resort - hardcoded result
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setAnalysisError(errorMessage);
        
        const fallbackResults = {
          foodName: 'Food Item',
          category: 'Food',
          ingredients: [
            { name: 'Mixed Ingredients', calories: 150 }
          ],
          nutrition: {
            calories: 200,
            carbs: 25,
            protein: 8,
            fats: 8
          },
          healthScore: 5,
          confidence: 0.3,
          error: errorMessage
        };
        
        setAnalysisResults(fallbackResults);
        setShowResults(true);
      }
    }
  };

  const resetCameraState = () => {
    // Reset all camera-related state
    setShowResults(false);
    setShowCamera(true);
    setCapturedImage(null);
    setAnalysisResults(null);
    setAnalysisError(null);
    setQuantity(1);
    setIsAnalyzing(false);
  };

  const handleDone = () => {
    console.log('✅ Done button pressed');
    console.log('📊 Analysis results available:', !!analysisResults);
    console.log('🖼️ Captured image available:', !!capturedImage);
    console.log('🔢 Current quantity:', quantity);
    
    if (analysisResults) {
      console.log('📋 Creating meal object...');
      const meal = {
        id: Date.now().toString(),
        name: analysisResults.foodName,
        calories: analysisResults.nutrition.calories * quantity,
        protein: analysisResults.nutrition.protein * quantity,
        carbs: analysisResults.nutrition.carbs * quantity,
        fat: analysisResults.nutrition.fats * quantity,
        timestamp: new Date(),
        image: capturedImage,
      };
      
      console.log('🍽️ Meal object created:', JSON.stringify(meal, null, 2));
      
      try {
        console.log('➕ Adding meal to context...');
        addMeal(meal);
        console.log('✅ Meal added successfully');
        
        console.log('🔄 Resetting camera state...');
        resetCameraState();
        console.log('✅ Camera state reset complete');
        
        // Add a small delay to ensure state is fully reset before navigation
        setTimeout(() => {
          console.log('🏠 Navigating to dashboard...');
          router.push('/(tabs)/dashboard');
          console.log('✅ Navigation initiated');
        }, 100);
      } catch (error) {
        console.log('❌ Error during meal addition:', error);
        Alert.alert('Error', 'Failed to save meal. Please try again.');
      }
    } else {
      console.log('❌ No analysis results available - cannot add meal');
      Alert.alert('Error', 'No food analysis data available');
    }
  };

  const handleBackFromResults = () => {
    resetCameraState();
  };

  const handleTakeAnotherPicture = () => {
    console.log('📸 Take Another Picture button pressed');
    console.log('📊 Analysis results available:', !!analysisResults);
    console.log('🖼️ Captured image available:', !!capturedImage);
    console.log('🔢 Current quantity:', quantity);
    
    if (analysisResults) {
      console.log('📋 Creating meal object for another picture...');
      const meal = {
        id: Date.now().toString(),
        name: analysisResults.foodName,
        calories: analysisResults.nutrition.calories * quantity,
        protein: analysisResults.nutrition.protein * quantity,
        carbs: analysisResults.nutrition.carbs * quantity,
        fat: analysisResults.nutrition.fats * quantity,
        timestamp: new Date(),
        image: capturedImage,
      };
      
      console.log('🍽️ Meal object created:', JSON.stringify(meal, null, 2));
      
      try {
        console.log('➕ Adding meal to context...');
        addMeal(meal);
        console.log('✅ Meal added successfully');
        
        console.log('🔄 Resetting camera state for another picture...');
        resetCameraState();
        console.log('✅ Camera state reset complete - ready for another photo');
        
        // No navigation - stay on camera screen for another photo
        console.log('📸 Ready to take another picture!');
      } catch (error) {
        console.log('❌ Error during meal addition:', error);
        Alert.alert('Error', 'Failed to save meal. Please try again.');
      }
    } else {
      console.log('❌ No analysis results available - cannot add meal');
      Alert.alert('Error', 'No food analysis data available');
    }
  };

  // Generate nutritional bubble labels for the image
  const generateNutritionalLabels = (nutrition: any) => {
    const labels = [];
    
    // Add main macros with values
    if (nutrition.protein > 0) {
      labels.push({ name: 'Protein', value: `${Math.round(nutrition.protein)}g` });
    }
    if (nutrition.carbs > 0) {
      labels.push({ name: 'Carbs', value: `${Math.round(nutrition.carbs)}g` });
    }
    if (nutrition.fats > 0) {
      labels.push({ name: 'Fats', value: `${Math.round(nutrition.fats)}g` });
    }
    
    // Add estimated vitamins/minerals based on food type
    if (analysisResults?.category === 'Protein' || analysisResults?.foodName?.toLowerCase().includes('steak')) {
      labels.push({ name: 'Iron', value: '15%' });
      labels.push({ name: 'B12', value: '25%' });
    }
    
    if (analysisResults?.category === 'Vegetable') {
      labels.push({ name: 'Vitamin C', value: '20%' });
      labels.push({ name: 'Fiber', value: '8g' });
    }
    
    if (analysisResults?.category === 'Fruit') {
      labels.push({ name: 'Vitamin C', value: '35%' });
      labels.push({ name: 'Potassium', value: '12%' });
    }
    
    // Add calories as the last label
    labels.push({ name: 'Calories', value: Math.round(nutrition.calories).toString() });
    
    return labels.slice(0, 5); // Limit to 5 labels to avoid overcrowding
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera permission is required</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Results Screen
  if (showResults && analysisResults) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={handleBackFromResults} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nutrition</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuDots}>⋯</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.resultsContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Food Image */}
          <View style={styles.foodImageContainer}>
            {capturedImage && (
              <Image source={{ uri: capturedImage }} style={styles.foodImage} />
            )}
            
            {/* Nutritional Labels */}
            {generateNutritionalLabels(analysisResults.nutrition).map((label: any, index: number) => (
              <View 
                key={index}
                style={[
                  styles.ingredientLabel,
                  { 
                    top: 50 + (index * 45),
                    right: 20 + (index * 25)
                  }
                ]}
              >
                <Text style={styles.ingredientText}>
                  {label.name}: {label.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            {(analysisResults.error || analysisResults.usingMockData) && (
              <View style={[styles.errorBanner, analysisResults.usingMockData && !analysisResults.error && styles.infoBanner]}>
                <Ionicons 
                  name={analysisResults.usingMockData && !analysisResults.error ? "information-circle" : "warning"} 
                  size={16} 
                  color={analysisResults.usingMockData && !analysisResults.error ? "#4CAF50" : "#ff6b6b"} 
                />
                <Text style={[styles.errorText, analysisResults.usingMockData && !analysisResults.error && styles.infoText]}>
                  {analysisResults.usingMockData && !analysisResults.error 
                    ? "Using simulated AI analysis" 
                    : "Analysis failed - showing estimates"}
                </Text>
              </View>
            )}
            <Text style={styles.foodCategory}>{analysisResults.category}</Text>
            <Text style={styles.foodName}>{analysisResults.foodName}</Text>
            {analysisResults.confidence && (
              <Text style={styles.confidenceText}>
                Confidence: {Math.round(analysisResults.confidence * 100)}%
              </Text>
            )}
            
            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Nutrition Grid */}
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🔥</Text>
                <Text style={styles.nutritionValue}>{analysisResults.nutrition.calories * quantity}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🌾</Text>
                <Text style={styles.nutritionValue}>{analysisResults.nutrition.carbs * quantity}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🥩</Text>
                <Text style={styles.nutritionValue}>{analysisResults.nutrition.protein * quantity}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🥑</Text>
                <Text style={styles.nutritionValue}>{analysisResults.nutrition.fats * quantity}g</Text>
                <Text style={styles.nutritionLabel}>Fats</Text>
              </View>
            </View>

            {/* Health Score */}
            <View style={styles.healthScoreContainer}>
              <Text style={styles.healthScoreIcon}>❤️</Text>
              <Text style={styles.healthScoreLabel}>Health score</Text>
              <View style={styles.healthScoreBar}>
                <View style={[styles.healthScoreFill, { width: `${analysisResults.healthScore * 10}%` }]} />
              </View>
              <Text style={styles.healthScoreValue}>{analysisResults.healthScore}/10</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.fixButton} onPress={handleTakeAnotherPicture}>
                <Text style={styles.fixButtonText}>Take Another</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Camera Screen
  return (
    <View style={styles.cameraContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <CameraView
        key={`camera-${showCamera}-${facing}`}
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.cameraOverlay}>
          {/* Header */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scanner</Text>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuDots}>⋯</Text>
            </TouchableOpacity>
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.frameCorner} />
          </View>

          {/* Scan Food Button */}
          <View style={styles.scanButtonContainer}>
            <TouchableOpacity style={styles.scanButton} onPress={capturePhoto}>
              <Ionicons name="camera" size={24} color="#333" />
              <Text style={styles.scanButtonText}>Scan food</Text>
            </TouchableOpacity>
            
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="flash" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <Modal visible={isAnalyzing} transparent>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Analyzing food...</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    color: '#fff',
    fontSize: 20,
  },
  scannerFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  frameCorner: {
    width: 250,
    height: 200,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#333',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resultsContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  foodImageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#000',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ingredientLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ingredientText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
    minHeight: 400,
  },
  foodCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginLeft: 8,
    fontWeight: '500',
  },
  infoBanner: {
    backgroundColor: '#e8f5e8',
  },
  infoText: {
    color: '#4CAF50',
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  nutritionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  healthScoreIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  healthScoreLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  healthScoreBar: {
    width: 60,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  healthScoreFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  healthScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
    marginBottom: 10,
  },
  fixButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  fixButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
