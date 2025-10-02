import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useCalories } from '../contexts/CalorieContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true); // Start with camera open
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const cameraRef = useRef<CameraView>(null);
  const { addMeal } = useCalories();

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
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          setCapturedImage(photo.uri);
          setShowCamera(false);
          analyzeFood(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      analyzeFood(result.assets[0].uri);
    }
  };

  const analyzeFood = async (imageUri: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with pancakes example
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analyzedFood = {
      name: 'Pancakes with blueberries & syrup',
      category: 'Breakfast',
      calories: 615,
      protein: 11,
      carbs: 93,
      fat: 21,
      healthScore: 7,
      maxHealthScore: 10,
      imageUri,
      ingredients: [
        { name: 'Blueberries', amount: 8 },
        { name: 'Syrup', amount: 12 },
        { name: 'Pancakes', amount: 595 }
      ]
    };
    
    setAnalysisResults(analyzedFood);
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleManualEntry = () => {
    Alert.alert('Manual Entry', 'Manual food entry will be implemented in future updates');
  };

  // Results Screen
  if (showResults && analysisResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nutrition</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuDots}>⋯</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.resultsContent}>
          {/* Food Image with Labels */}
          <View style={styles.foodImageContainer}>
            <Image source={{ uri: analysisResults.imageUri }} style={styles.foodImage} />
            
            {/* Ingredient Labels */}
            <View style={[styles.ingredientLabel, { top: 80, left: 40 }]}>
              <Text style={styles.ingredientName}>Blueberries</Text>
              <Text style={styles.ingredientAmount}>8</Text>
            </View>
            
            <View style={[styles.ingredientLabel, { top: 160, left: 20 }]}>
              <Text style={styles.ingredientName}>Syrup</Text>
              <Text style={styles.ingredientAmount}>12</Text>
            </View>
            
            <View style={[styles.ingredientLabel, { top: 120, right: 20 }]}>
              <Text style={styles.ingredientName}>Pancakes</Text>
              <Text style={styles.ingredientAmount}>595</Text>
            </View>
          </View>

          {/* Food Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.categoryLabel}>{analysisResults.category}</Text>
            <Text style={styles.foodName}>{analysisResults.name}</Text>
            
            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>−</Text>
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
                <View>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{analysisResults.calories * quantity}</Text>
                </View>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🌾</Text>
                <View>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                  <Text style={styles.nutritionValue}>{analysisResults.carbs * quantity}g</Text>
                </View>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🥩</Text>
                <View>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>{analysisResults.protein * quantity}g</Text>
                </View>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionIcon}>🥑</Text>
                <View>
                  <Text style={styles.nutritionLabel}>Fats</Text>
                  <Text style={styles.nutritionValue}>{analysisResults.fat * quantity}g</Text>
                </View>
              </View>
            </View>

            {/* Health Score */}
            <View style={styles.healthScoreContainer}>
              <Text style={styles.healthScoreIcon}>💖</Text>
              <Text style={styles.healthScoreLabel}>Health score</Text>
              <View style={styles.healthScoreBar}>
                <View 
                  style={[
                    styles.healthScoreFill, 
                    { width: `${(analysisResults.healthScore / analysisResults.maxHealthScore) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.healthScoreValue}>{analysisResults.healthScore}/{analysisResults.maxHealthScore}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.fixButton}>
                <Text style={styles.fixButtonIcon}>✨</Text>
                <Text style={styles.fixButtonText}>Fix Results</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => {
                  const mealData = {
                    ...analysisResults,
                    calories: analysisResults.calories * quantity,
                    protein: analysisResults.protein * quantity,
                    carbs: analysisResults.carbs * quantity,
                    fat: analysisResults.fat * quantity,
                    quantity
                  };
                  addMeal(mealData);
                  router.back();
                }}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Camera Screen
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <SafeAreaView style={styles.cameraOverlay}>
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

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Scan Food Button */}
              <TouchableOpacity style={styles.scanButton} onPress={capturePhoto}>
                <Text style={styles.scanIcon}>📷</Text>
                <Text style={styles.scanText}>Scan food</Text>
              </TouchableOpacity>

              {/* Camera Controls */}
              <View style={styles.cameraControlsRow}>
                <TouchableOpacity style={styles.flashButton}>
                  <Text style={styles.flashIcon}>⚡</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                >
                  <Text style={styles.flipIcon}>🔄</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Loading Overlay */}
            {isAnalyzing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Analyzing food...</Text>
              </View>
            )}
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Results Screen Styles
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    fontSize: 18,
    color: '#333',
  },
  resultsContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  foodImageContainer: {
    height: 250,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  ingredientLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  ingredientName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  categoryLabel: {
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  nutritionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  healthScoreIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  healthScoreLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  healthScoreBar: {
    width: 100,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  healthScoreFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  healthScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  fixButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingVertical: 15,
  },
  fixButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  fixButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // Camera Screen Styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scannerFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  frameCorner: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  bottomControls: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 30,
  },
  scanIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  scanText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  cameraControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  flashButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashIcon: {
    fontSize: 24,
    color: '#fff',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#000000',
  },
  captureButtonInner: {
    backgroundColor: '#000000',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIcon: {
    fontSize: 24,
    color: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
});
