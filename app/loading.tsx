import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { calculateAndSaveNutritionGoals } from '../lib/nutrition-helpers';
import { NutritionGoals } from '../lib/nutrition-calculator';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  const { user } = useAuth();
  const { profile } = useUser();

  // Wait for profile to be loaded from AsyncStorage
  useEffect(() => {
    const checkProfileLoaded = () => {
      console.log('=== PROFILE LOADING CHECK ===');
      console.log('Profile exists:', !!profile);
      console.log('Profile data:', JSON.stringify(profile, null, 2));
      
      // Check if profile has actual data (not just default null values)
      const hasProfileData = profile && (
        profile.gender !== null || profile.age !== null || profile.weight !== null || 
        profile.height !== null || profile.activityLevel !== null || profile.goal !== null || 
        profile.dietPreference !== null
      );
      
      if (hasProfileData) {
        console.log('✅ Profile data loaded from storage');
        setProfileLoaded(true);
      } else {
        console.log('⏳ Waiting for profile data to load...');
        // Keep checking every 200ms until profile is loaded (increased interval)
        setTimeout(checkProfileLoaded, 200);
      }
    };

    // Add initial delay to allow UserContext to load
    setTimeout(checkProfileLoaded, 300);
  }, [profile]);

  const navigateToResults = () => {
    router.replace('results');
  };

  const recommendations = ['Calories', 'Carbs', 'Protein', 'Fats', 'Health Score'];

  // Calculate nutrition goals when profile is loaded
  useEffect(() => {
    const calculateNutrition = async () => {
      console.log('=== LOADING SCREEN DEBUG ===');
      console.log('User ID:', user?.id);
      console.log('Profile loaded:', profileLoaded);
      console.log('Profile exists:', !!profile);
      console.log('Full profile data:', JSON.stringify(profile, null, 2));
      
      if (!user?.id) {
        console.log('❌ No user ID found');
        return;
      }
      
      if (!profileLoaded) {
        console.log('⏳ Profile not loaded yet, waiting...');
        return;
      }
      
      if (!profile) {
        console.log('❌ No profile data found');
        return;
      }

      // Check if we have all required profile data
      const missingFields = [];
      if (profile.gender === null || profile.gender === undefined) missingFields.push('gender');
      if (profile.age === null || profile.age === undefined || profile.age === 0) missingFields.push('age');
      if (profile.weight === null || profile.weight === undefined || profile.weight === 0) missingFields.push('weight');
      if (profile.height === null || profile.height === undefined || profile.height === 0) missingFields.push('height');
      if (profile.activityLevel === null || profile.activityLevel === undefined) missingFields.push('activityLevel');
      if (profile.goal === null || profile.goal === undefined) missingFields.push('goal');
      if (profile.dietPreference === null || profile.dietPreference === undefined) missingFields.push('dietPreference');

      console.log('=== PROFILE VALIDATION ===');
      console.log('Profile validation check:');
      console.log('- Gender:', profile.gender, '(valid:', profile.gender !== null && profile.gender !== undefined, ')');
      console.log('- Age:', profile.age, '(valid:', profile.age !== null && profile.age !== undefined && profile.age !== 0, ')');
      console.log('- Weight:', profile.weight, '(valid:', profile.weight !== null && profile.weight !== undefined && profile.weight !== 0, ')');
      console.log('- Height:', profile.height, '(valid:', profile.height !== null && profile.height !== undefined && profile.height !== 0, ')');
      console.log('- Activity Level:', profile.activityLevel, '(valid:', profile.activityLevel !== null && profile.activityLevel !== undefined, ')');
      console.log('- Goal:', profile.goal, '(valid:', profile.goal !== null && profile.goal !== undefined, ')');
      console.log('- Diet Preference:', profile.dietPreference, '(valid:', profile.dietPreference !== null && profile.dietPreference !== undefined, ')');
      console.log('Missing fields:', missingFields);

      if (missingFields.length > 0) {
        console.log('❌ Profile incomplete, missing fields:', missingFields);
        Alert.alert(
          'Incomplete Profile',
          `Missing: ${missingFields.join(', ')}. Would you like to use default nutrition goals or go back to complete your profile?`,
          [
            { 
              text: 'Go Back', 
              onPress: () => router.back() 
            },
            { 
              text: 'Use Defaults', 
              onPress: () => {
                console.log('Using default nutrition goals');
                setCalculationComplete(true);
              }
            }
          ]
        );
        return;
      }

      console.log('✅ Profile validation passed - all required fields present');

      try {
        console.log('Calculating nutrition goals for profile:', profile);
        
        const result = await calculateAndSaveNutritionGoals(user.id, {
          gender: profile.gender,
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          dietPreference: profile.dietPreference
        });

        if (result.success && result.goals) {
          setNutritionGoals(result.goals);
          setCalculationComplete(true);
          console.log('✅ Nutrition calculation completed:', result.goals);
        } else {
          console.error('❌ Nutrition calculation failed:', result.error);
          Alert.alert(
            'Calculation Error',
            'Failed to calculate nutrition goals. Using default values.',
            [{ text: 'Continue', onPress: () => setCalculationComplete(true) }]
          );
        }
      } catch (error) {
        console.error('Error during nutrition calculation:', error);
        setCalculationComplete(true); // Continue anyway
      }
    };

    // Add a small delay to ensure profile data is loaded
    const timer = setTimeout(() => {
      calculateNutrition();
    }, 800);

    // Fallback: if profile loading takes too long (>5 seconds), proceed with defaults
    const fallbackTimer = setTimeout(() => {
      if (!calculationComplete) {
        console.log('⚠️ Profile loading timeout - proceeding with default goals');
        setCalculationComplete(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [user?.id, profile, profileLoaded]);

  useEffect(() => {
    // Only start progress animation after calculation is complete
    if (!calculationComplete) return;

    // Progress animation from 0% to 92% then to 100%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) {
          clearInterval(progressInterval);
          // Hold at 92% for 1 second, then go to 100%
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              navigateToResults();
            }, 1000);
          }, 1000);
          return 92;
        }
        return prev + 2;
      });
    }, 80);

    // Mark items as completed progressively
    const itemInterval = setInterval(() => {
      setCompletedItems(prev => {
        const nextIndex = prev.findIndex(item => !item);
        if (nextIndex === -1) {
          clearInterval(itemInterval);
          return prev;
        }
        const newItems = [...prev];
        newItems[nextIndex] = true;
        return newItems;
      });
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(itemInterval);
    };
  }, [calculationComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.touchableContainer} 
        onPress={navigateToResults}
        activeOpacity={1}
      >
        <View style={styles.content}>
          {/* Main percentage */}
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{progress}%</Text>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>Fitly</Text>
            <Text style={styles.title}>We're setting</Text>
            <Text style={styles.title}>everything up for you</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {!calculationComplete ? 'Calculating your personalized nutrition goals...' : 'Finalizing results...'}
            </Text>
          </View>

          {/* Black checklist card */}
          <View style={styles.checklistContainer}>
            <Text style={styles.checklistTitle}>Daily recommendation for</Text>
            
            <View style={styles.checklistItems}>
              {recommendations.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{item}</Text>
                  <View style={[
                    styles.checkmark,
                    completedItems[index] && styles.checkmarkCompleted
                  ]}>
                    {completedItems[index] && (
                      <Ionicons name="checkmark" size={16} color="#000" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom home indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  touchableContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getContainerPadding().horizontal,
  },
  percentageContainer: {
    marginBottom: getSpacing(24, 28, 32),
  },
  percentage: {
    fontSize: getFontSize(70, 85, 100),
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: rs(-4),
  },
  titleContainer: {
    marginBottom: getSpacing(36, 42, 48),
    alignItems: 'center',
  },
  appTitle: {
    fontSize: getFontSize(32, 36, 40),
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: getSpacing(16, 18, 20),
  },
  title: {
    fontSize: getFontSize(20, 22, 24),
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: getFontSize(26, 28, 30),
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: getSpacing(44, 50, 56),
    paddingHorizontal: getContainerPadding().horizontal,
  },
  progressBarTrack: {
    width: '100%',
    height: rs(8),
    backgroundColor: '#E8E8E8',
    borderRadius: rs(4),
    overflow: 'hidden',
    marginBottom: getSpacing(12, 14, 16),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: rs(4),
  },
  progressText: {
    fontSize: getFontSize(14, 15, 16),
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  checklistContainer: {
    backgroundColor: '#000000',
    borderRadius: rs(20),
    padding: getSpacing(20, 22, 24),
    width: '100%',
    maxWidth: isSmallScreen ? wp(90) : rs(320),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: getSpacing(60, 70, 80),
  },
  checklistTitle: {
    fontSize: getFontSize(16, 17, 18),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: getSpacing(16, 18, 20),
  },
  checklistItems: {
    gap: getSpacing(12, 14, 16),
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: getFontSize(14, 15, 16),
    color: '#ffffff',
    marginRight: getSpacing(10, 11, 12),
    width: rs(8),
    fontWeight: '400',
  },
  itemText: {
    fontSize: getFontSize(14, 15, 16),
    color: '#ffffff',
    flex: 1,
    fontWeight: '500',
  },
  checkmark: {
    width: rs(26),
    height: rs(26),
    borderRadius: rs(13),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#444444',
  },
  checkmarkCompleted: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: getSpacing(24, 27, 30),
    width: rs(134),
    height: rs(5),
    backgroundColor: '#000000',
    borderRadius: rs(3),
  },
});
