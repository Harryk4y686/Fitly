import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding } from '../utils/responsive';

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<'lose_weight' | 'maintain_weight' | 'gain_weight' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useUser();

  const handleContinue = async () => {
    if (selectedGoal && !isLoading) {
      try {
        console.log('=== GOALS SAVE ATTEMPT ===');
        console.log('Selected goal:', selectedGoal);
        console.log('User ID:', user?.id);
        
        // Always save to local context first
        console.log('Saving goal to local context:', selectedGoal);
        updateProfile({ goal: selectedGoal });

        if (user?.id) {
          // Also save to database if authenticated
          console.log('Saving to database (authenticated)');
          const result = await updateUserProfile(user.id, { goal: selectedGoal });
          
          if (result.error) {
            console.error('Database save failed:', result.error);
            // Don't block the user, just log the error
            console.log('Continuing with local storage only');
          } else {
            console.log('Goal saved successfully to database:', result.data);
          }
        }
        
        router.push('/complete');
      } catch (error) {
        console.error('Error saving goal:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const goalOptions: Array<{ 
    id: 'lose_weight' | 'maintain_weight' | 'gain_weight'; 
    label: string;
    icon: any;
  }> = [
    { id: 'lose_weight', label: 'Lose weight', icon: 'trending-down' },
    { id: 'maintain_weight', label: 'Maintain', icon: 'remove' },
    { id: 'gain_weight', label: 'Gain weight', icon: 'trending-up' },
  ];

  return (
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
        <Text style={styles.title}>What is your goal?</Text>
        <Text style={styles.subtitle}>This helps us generate a plan for your calorie intake.</Text>

        <View style={styles.optionsContainer}>
          {goalOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedGoal === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedGoal(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.iconContainer,
                  selectedGoal === option.id && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={24} 
                    color="#000000"
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  selectedGoal === option.id && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedGoal || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal || isLoading}
        >
          <Text style={[
            styles.continueButtonText,
            (!selectedGoal || isLoading) && styles.continueButtonTextDisabled
          ]}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
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
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: rs(2),
  },
  content: {
    flex: 1,
    paddingHorizontal: getContainerPadding().horizontal,
    paddingTop: getSpacing(16, 20, 24),
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
    color: '#666666',
    marginBottom: getSpacing(40, 50, 60),
    lineHeight: getFontSize(20, 22, 24),
  },
  optionsContainer: {
    gap: getSpacing(12, 14, 16),
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: getSpacing(16, 18, 20),
    paddingHorizontal: getSpacing(16, 18, 20),
    borderRadius: rs(16),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: getSpacing(60, 70, 80),
  },
  selectedOption: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 2,
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(22),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(12, 14, 16),
  },
  selectedIconContainer: {
    backgroundColor: '#ffffff',
  },
  optionText: {
    fontSize: getFontSize(16, 17, 18),
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    paddingHorizontal: getContainerPadding().horizontal,
    paddingBottom: getSpacing(32, 36, 40),
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: getSpacing(18, 20, 22),
    borderRadius: rs(30),
    alignItems: 'center',
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
