import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingGuard from '../components/OnboardingGuard';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding } from '../utils/responsive';

export default function WorkoutScreen() {
  const [selectedWorkout, setSelectedWorkout] = useState<'never' | '1-2' | '3-4' | '5-6' | 'daily' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useUser();

  const handleContinue = async () => {
    if (selectedWorkout && !isLoading) {
      setIsLoading(true);
      try {
        console.log('=== WORKOUT SAVE ATTEMPT ===');
        console.log('Selected workout:', selectedWorkout);
        console.log('User ID:', user?.id);
        
        if (user) {
          // Authenticated user - save to database
          console.log('Saving to database for user:', user.id);
          // Save workout frequency to database
          const result = await updateUserProfile(user.id, { workout_frequency: selectedWorkout });
          
          if (result.error) {
            console.error('Failed to save workout frequency:', result.error);
            alert('Failed to save data. Please try again.');
            return;
          }
          
          console.log('Workout frequency saved successfully to database:', result.data);
        } else {
          // Unauthenticated user - save to local context
          console.log('Saving to local context (no auth)');
          updateProfile({ activityLevel: selectedWorkout === 'never' ? 'sedentary' : 
                          selectedWorkout === '1-2' ? 'light' :
                          selectedWorkout === '3-4' ? 'moderate' :
                          selectedWorkout === '5-6' ? 'active' : 'very_active' });
        }
        
        router.push('/birthdate');
      } catch (error) {
        console.error('Error saving workout frequency:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const workoutOptions: Array<{ 
    id: 'never' | '1-2' | '3-4' | '5-6' | 'daily'; 
    title: string; 
    subtitle: string;
  }> = [
    { 
      id: 'never', 
      title: '0-2', 
      subtitle: 'We should row out then'
    },
    { 
      id: '1-2', 
      title: '3-5', 
      subtitle: 'A few hours per week'
    },
    { 
      id: '3-4', 
      title: '6+', 
      subtitle: 'Dedicated athlete'
    },
  ];

  // Debug log current selection
  React.useEffect(() => {
    console.log('Current selectedWorkout:', selectedWorkout);
    console.log('Continue button enabled:', !!selectedWorkout && !isLoading);
  }, [selectedWorkout, isLoading]);

  return (
    // <OnboardingGuard step="workout">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How many workouts do you do per week?</Text>
        <Text style={styles.subtitle}>This will be used to calibrate your custom plan.</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {workoutOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedWorkout === option.id && styles.selectedOption
            ]}
            onPress={() => {
              console.log('🔥 Tapped workout option:', option.id);
              console.log('🔥 Previous selection:', selectedWorkout);
              setSelectedWorkout(option.id);
              console.log('🔥 New selection should be:', option.id);
            }}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.radioButton,
                selectedWorkout === option.id && styles.radioButtonSelected
              ]}>
                {selectedWorkout === option.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionTitle,
                  selectedWorkout === option.id && styles.selectedOptionText
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.optionSubtitle,
                  selectedWorkout === option.id && styles.selectedOptionSubtitle
                ]}>
                  {option.subtitle}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedWorkout || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedWorkout || isLoading}
        >
          <Text style={[
            styles.continueButtonText,
            (!selectedWorkout || isLoading) && styles.continueButtonTextDisabled
          ]}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    // </OnboardingGuard>
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
    paddingTop: getSpacing(10, 12, 16),
    paddingBottom: getSpacing(16, 20, 24),
  },
  backButton: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: rs(15),
  },
  progressBar: {
    height: rs(4),
    backgroundColor: '#f0f0f0',
    borderRadius: rs(2),
    overflow: 'hidden',
  },
  progressFill: {
    width: '40%', // 2/5 progress
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: rs(2),
  },
  content: {
    paddingHorizontal: getContainerPadding().horizontal,
    paddingTop: getSpacing(16, 20, 24),
    paddingBottom: getSpacing(16, 20, 24),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: getContainerPadding().horizontal,
  },
  title: {
    fontSize: getFontSize(28, 32, 38),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: getSpacing(10, 12, 16),
    lineHeight: getFontSize(32, 36, 42),
  },
  subtitle: {
    fontSize: getFontSize(16, 18, 20),
    color: '#666',
    marginBottom: getSpacing(40, 50, 60),
    lineHeight: getFontSize(20, 22, 24),
  },
  optionsContainer: {
    gap: getSpacing(12, 15, 18),
    paddingVertical: getSpacing(16, 20, 24),
    paddingBottom: getSpacing(80, 90, 100), // Extra space for Continue button
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: getSpacing(16, 18, 20),
    paddingHorizontal: getSpacing(16, 18, 20),
    borderRadius: rs(16),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    minHeight: getSpacing(60, 70, 80),
  },
  selectedOption: {
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#000000',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: rs(24),
    height: rs(24),
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(12, 14, 16),
  },
  radioButtonSelected: {
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  radioButtonInner: {
    width: rs(12),
    height: rs(12),
    borderRadius: rs(6),
    backgroundColor: '#000000',
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: getFontSize(16, 17, 18),
    color: '#000000',
    fontWeight: '600',
    marginBottom: rs(4),
  },
  optionSubtitle: {
    fontSize: getFontSize(12, 13, 14),
    color: '#666666',
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  selectedOptionSubtitle: {
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: getContainerPadding().horizontal,
    paddingBottom: getSpacing(32, 36, 40),
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: getSpacing(18, 20, 22),
    borderRadius: rs(30),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minHeight: getButtonHeight(),
  },
  continueButtonDisabled: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: getFontSize(16, 17, 18),
    fontWeight: '700',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});
