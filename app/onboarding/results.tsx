import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { completeOnboarding } from '../../lib/database';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const { user } = useAuth();
  const { profile } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    // Mark onboarding as complete if user is authenticated
    if (user) {
      await completeOnboarding(user.id);
    }
    router.replace('/(tabs)/dashboard');
  };

  // Calculate personalized recommendations based on user profile
  const calculateRecommendations = () => {
    const baseCalories = profile.gender === 'male' ? 2200 : 1800;
    const activityMultiplier = profile.activityLevel === 'active' ? 1.3 : 
                              profile.activityLevel === 'light' ? 1.2 : 1.1;
    const goalMultiplier = profile.goal === 'lose_weight' ? 0.85 : 
                          profile.goal === 'gain_weight' ? 1.15 : 1.0;
    
    const calories = Math.round(baseCalories * activityMultiplier * goalMultiplier);
    const carbs = Math.round(calories * 0.45 / 4); // 45% of calories from carbs
    const protein = Math.round(calories * 0.25 / 4); // 25% from protein
    const fats = Math.round(calories * 0.30 / 9); // 30% from fats
    
    return { calories, carbs, protein, fats };
  };

  const recommendations = calculateRecommendations();

  const CircularProgress = ({ value, max, color, label, unit }: {
    value: number;
    max: number;
    color: string;
    label: string;
    unit: string;
  }) => {
    const percentage = (value / max) * 100;
    const strokeDasharray = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <View style={[styles.progressRing, { borderColor: '#f0f0f0' }]}>
            <View style={[
              styles.progressFill,
              { 
                borderTopColor: color,
                borderRightColor: color,
                transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
              }
            ]} />
          </View>
          <View style={styles.progressCenter}>
            <Text style={styles.progressValue}>{value}</Text>
            <Text style={styles.progressUnit}>{unit}</Text>
          </View>
        </View>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <Animated.View style={[
          styles.successContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }
        ]}>
          <View style={styles.celebrationContainer}>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={32} color="#fff" />
            </View>
            <View style={styles.sparkleContainer}>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>✨</Text>
            </View>
          </View>
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsSubtitle}>Your personalized plan is ready</Text>
          
          <View style={styles.goalContainer}>
            <View style={styles.goalBadge}>
              <Ionicons name="flag" size={20} color="#000000" />
              <Text style={styles.goalLabel}>Target Goal</Text>
            </View>
            <Text style={styles.goalValue}>Lose 11.0 lbs by October 18</Text>
          </View>
        </Animated.View>

        {/* Daily Recommendations */}
        <Animated.View style={[
          styles.recommendationsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color="#000000" />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Daily Recommendations</Text>
              <Text style={styles.sectionSubtitle}>Personalized just for you</Text>
            </View>
          </View>
          
          <View style={styles.progressGrid}>
            <CircularProgress 
              value={recommendations.calories} 
              max={3000} 
              color="#333" 
              label="Calories" 
              unit="kcal"
            />
            <CircularProgress 
              value={recommendations.carbs} 
              max={400} 
              color="#FFA726" 
              label="Carbs" 
              unit="g"
            />
            <CircularProgress 
              value={recommendations.protein} 
              max={200} 
              color="#EF5350" 
              label="Protein" 
              unit="g"
            />
            <CircularProgress 
              value={recommendations.fats} 
              max={100} 
              color="#42A5F5" 
              label="Fats" 
              unit="g"
            />
          </View>

          {/* Health Score */}
          <View style={styles.healthScoreContainer}>
            <View style={styles.healthScoreIconContainer}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.healthScoreContent}>
              <Text style={styles.healthScoreLabel}>Health Score</Text>
              <View style={styles.healthScoreBar}>
                <View style={[styles.healthScoreFill, { width: '70%' }]} />
              </View>
            </View>
            <Text style={styles.healthScoreValue}>7/10</Text>
          </View>
        </Animated.View>

        {/* How to reach your goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.goalsSectionTitle}>How to reach your goals:</Text>
          
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>💖</Text>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalItemTitle}>Get your weekly life score and improve your routine.</Text>
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🥗</Text>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalItemTitle}>Track your food</Text>
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🎯</Text>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalItemTitle}>Follow your daily calorie recommendation</Text>
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>⚖️</Text>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalItemTitle}>Balance your carbs, protein, fat</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sources */}
        <View style={styles.sourcesSection}>
          <Text style={styles.sourcesTitle}>
            Plan based on the following sources, among other peer-reviewed medical studies:
          </Text>
          <View style={styles.sourcesList}>
            <Text style={styles.sourceItem}>• Basal metabolic rate</Text>
            <Text style={styles.sourceItem}>• Calorie counting - Harvard</Text>
            <Text style={styles.sourceItem}>• International Society of Sports Nutrition</Text>
            <Text style={styles.sourceItem}>• National Institutes of Health</Text>
          </View>
        </View>

        {/* Continue Button */}
        <Animated.View style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View style={styles.continueButtonContent}>
              <Text style={styles.continueButtonText}>Start Your Journey</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  backArrow: {
    fontSize: 18,
    color: '#333',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  celebrationContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  sparkle: {
    fontSize: 20,
    opacity: 0.8,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  congratsSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  goalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 6,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  recommendationsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  progressContainer: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
  },
  progressCircle: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
  },
  progressFill: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: 'transparent',
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressUnit: {
    fontSize: 12,
    color: '#666',
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef7f7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  healthScoreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  healthScoreContent: {
    flex: 1,
  },
  healthScoreBar: {
    height: 8,
    backgroundColor: '#fed7d7',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  healthScoreFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  healthScoreIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  healthScoreLabel: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '600',
  },
  healthScoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  goalsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  goalsList: {
    gap: 15,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalItemTitle: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  sourcesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sourcesTitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  sourcesList: {
    gap: 8,
  },
  sourceItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});
