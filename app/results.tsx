import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { getUserProfile, UserProfile as DatabaseUserProfile } from '../lib/database';
import { getNutritionRecommendations } from '../lib/nutrition-helpers';

export default function ResultsScreen() {
  const [userProfile, setUserProfile] = useState<DatabaseUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const profileData = await getUserProfile(user.id);
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleContinue = () => {
    router.replace('/(tabs)/dashboard');
  };

  // Get diet-specific recommendations
  const recommendations = profile?.dietPreference ? 
    getNutritionRecommendations(profile.dietPreference) : null;

  // Format goal text based on user's goal
  const getGoalText = () => {
    if (!profile?.goal) return "Maintain your current weight";
    
    switch (profile.goal) {
      case 'lose_weight':
        return "Lose 1-2 lbs per week safely";
      case 'gain_weight':
        return "Gain 0.5-1 lb per week with lean muscle";
      case 'maintain_weight':
      default:
        return "Maintain your current weight";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with back button and progress bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerProgressBar}>
          <View style={styles.headerProgressFill} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={32} color="#ffffff" />
          </View>
          <Text style={styles.congratsTitle}>Congratulations</Text>
          <Text style={styles.congratsSubtitle}>your custom plan is ready!</Text>
          
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>Your goal:</Text>
            <Text style={styles.goalValue}>{getGoalText()}</Text>
          </View>
        </View>

        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Daily recommendation</Text>
          <Text style={styles.sectionSubtitle}>You can edit this anytime</Text>
          
          <View style={styles.progressGrid}>
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.progressCircle, { borderColor: '#FF6B6B' }]}>
                  <View style={[styles.progressArc, { borderTopColor: '#FF6B6B', borderRightColor: '#FF6B6B' }]} />
                  <View style={styles.progressValueContainer}>
                    <Text style={styles.progressValue}>
                      {userProfile?.daily_calorie_goal || 2000}
                    </Text>
                  </View>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={styles.progressLabel}>Calories</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <Svg width={80} height={80}>
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#f0f0f0"
                    strokeWidth={6}
                    fill="none"
                  />
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#FFA726"
                    strokeWidth={6}
                    fill="none"
                    strokeDasharray={220}
                    strokeDashoffset={66}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </Svg>
                <View style={styles.progressValueContainer}>
                  <Text style={styles.progressValue}>
                    {userProfile?.daily_carbs_goal || 250}
                  </Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="leaf" size={16} color="#FFA726" />
                <Text style={styles.progressLabel}>Carbs</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <Svg width={80} height={80}>
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#f0f0f0"
                    strokeWidth={6}
                    fill="none"
                  />
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#EF5350"
                    strokeWidth={6}
                    fill="none"
                    strokeDasharray={220}
                    strokeDashoffset={88}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </Svg>
                <View style={styles.progressValueContainer}>
                  <Text style={styles.progressValue}>
                    {userProfile?.daily_protein_goal || 150}
                  </Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="fitness" size={16} color="#EF5350" />
                <Text style={styles.progressLabel}>Protein</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <Svg width={80} height={80}>
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#f0f0f0"
                    strokeWidth={6}
                    fill="none"
                  />
                  <Circle
                    cx={40}
                    cy={40}
                    r={35}
                    stroke="#42A5F5"
                    strokeWidth={6}
                    fill="none"
                    strokeDasharray={220}
                    strokeDashoffset={154}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </Svg>
                <View style={styles.progressValueContainer}>
                  <Text style={styles.progressValue}>
                    {userProfile?.daily_fat_goal || 65}
                  </Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="water" size={16} color="#42A5F5" />
                <Text style={styles.progressLabel}>Fats</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.goalsSectionTitle}>How to reach your goals:</Text>
          
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>💖</Text>
              <Text style={styles.goalItemTitle}>Get your weekly life score and improve your routine.</Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🥗</Text>
              <Text style={styles.goalItemTitle}>Track your food with AI-powered scanning</Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🎯</Text>
              <Text style={styles.goalItemTitle}>
                Follow your daily {userProfile?.daily_calorie_goal || 2000} calorie recommendation
              </Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>⚖️</Text>
              <Text style={styles.goalItemTitle}>
                Balance your macros: {userProfile?.daily_protein_goal || 150}g protein, {userProfile?.daily_carbs_goal || 250}g carbs, {userProfile?.daily_fat_goal || 65}g fats
              </Text>
            </View>

            {recommendations && (
              <View style={styles.goalItem}>
                <Text style={styles.goalIcon}>
                  {profile?.dietPreference === 'vegan' ? '🌱' : 
                   profile?.dietPreference === 'vegetarian' ? '🥬' :
                   profile?.dietPreference === 'pescatarian' ? '🐟' : '🍖'}
                </Text>
                <Text style={styles.goalItemTitle}>
                  {profile?.dietPreference === 'vegan' ? 'Focus on plant-based proteins like legumes, quinoa, and nuts' :
                   profile?.dietPreference === 'vegetarian' ? 'Include eggs, dairy, and plant proteins for complete nutrition' :
                   profile?.dietPreference === 'pescatarian' ? 'Include fish 2-3 times per week for omega-3 fatty acids' :
                   'Choose lean proteins and include variety in your diet'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Let's get started!</Text>
          </TouchableOpacity>
          
          {/* Bottom home indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getContainerPadding().horizontal,
    paddingVertical: getSpacing(12, 14, 16),
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: rs(16),
  },
  headerProgressBar: {
    flex: 1,
    height: rs(4),
    backgroundColor: '#e0e0e0',
    borderRadius: rs(2),
  },
  headerProgressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: rs(2),
  },
  scrollView: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: getContainerPadding().horizontal,
    paddingVertical: getSpacing(32, 36, 40),
  },
  checkmarkContainer: {
    width: rs(60),
    height: rs(60),
    borderRadius: rs(30),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing(20, 22, 24),
  },
  congratsTitle: {
    fontSize: getFontSize(24, 26, 28),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: getSpacing(6, 7, 8),
  },
  congratsSubtitle: {
    fontSize: getFontSize(18, 19, 20),
    fontWeight: '600',
    color: '#000000',
    marginBottom: getSpacing(28, 30, 32),
  },
  goalContainer: {
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: getContainerPadding().horizontal,
    borderRadius: 0,
    padding: getSpacing(20, 22, 24),
    marginBottom: getSpacing(32, 36, 40),
  },
  sectionTitle: {
    fontSize: getFontSize(20, 21, 22),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: getSpacing(6, 7, 8),
  },
  sectionSubtitle: {
    fontSize: getFontSize(14, 15, 16),
    color: '#999999',
    marginBottom: getSpacing(28, 30, 32),
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressContainer: {
    alignItems: 'center',
    width: '48%',
    marginBottom: getSpacing(28, 30, 32),
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing(10, 11, 12),
  },
  progressValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: rs(80),
    height: rs(80),
  },
  progressValue: {
    fontSize: getFontSize(16, 17, 18),
    fontWeight: 'bold',
    color: '#000000',
  },
  progressUnit: {
    fontSize: getFontSize(10, 11, 12),
    color: '#666666',
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  progressCircle: {
    width: rs(80),
    height: rs(80),
    borderRadius: rs(40),
    borderWidth: rs(6),
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressArc: {
    position: 'absolute',
    width: rs(80),
    height: rs(80),
    borderRadius: rs(40),
    borderWidth: rs(6),
    borderColor: 'transparent',
    borderTopColor: '#f0f0f0',
    borderRightColor: '#f0f0f0',
    transform: [{ rotate: '-90deg' }],
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
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
  healthScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  goalItemTitle: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    paddingHorizontal: getContainerPadding().horizontal,
    paddingBottom: getSpacing(32, 36, 40),
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: getSpacing(16, 17, 18),
    borderRadius: rs(30),
    alignItems: 'center',
    marginBottom: getSpacing(16, 18, 20),
    minHeight: getButtonHeight(),
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: getFontSize(16, 17, 18),
    fontWeight: '700',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: rs(134),
    height: rs(5),
    backgroundColor: '#000000',
    borderRadius: rs(3),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
