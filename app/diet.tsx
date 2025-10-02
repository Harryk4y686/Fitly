import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding } from '../utils/responsive';

export default function DietScreen() {
  const [selectedDiet, setSelectedDiet] = useState<'classic' | 'pescatarian' | 'vegetarian' | 'vegan' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useUser();

  const handleContinue = async () => {
    if (selectedDiet && !isLoading) {
      try {
        console.log('=== DIET SAVE ATTEMPT ===');
        console.log('Selected diet:', selectedDiet);
        console.log('User ID:', user?.id);
        
        // Always save to local context first
        console.log('Saving diet preference to local context:', selectedDiet);
        updateProfile({ dietPreference: selectedDiet });

        if (user?.id) {
          // Also save to database if authenticated
          console.log('Saving to database (authenticated)');
          const result = await updateUserProfile(user.id, { diet_preference: selectedDiet });
          
          if (result.error) {
            console.error('Database save failed:', result.error);
            // Don't block the user, just log the error
            console.log('Continuing with local storage only');
          } else {
            console.log('Diet preference saved successfully to database:', result.data);
          }
        }
        
        router.push('/goals');
      } catch (error) {
        console.error('Error saving diet preference:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const dietOptions: Array<{ 
    id: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan'; 
    label: string;
    icon: any;
  }> = [
    { id: 'classic', label: 'Classic', icon: 'restaurant' },
    { id: 'pescatarian', label: 'Pescatarian', icon: 'fish' },
    { id: 'vegetarian', label: 'Vegetarian', icon: 'leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'nutrition' },
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
        <Text style={styles.title}>Do you follow a specific diet?</Text>

        <View style={styles.optionsContainer}>
          {dietOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedDiet === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedDiet(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.iconContainer,
                  selectedDiet === option.id && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={24} 
                    color="#000000"
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  selectedDiet === option.id && styles.selectedOptionText
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
            (!selectedDiet || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDiet || isLoading}
        >
          <Text style={[
            styles.continueButtonText,
            (!selectedDiet || isLoading) && styles.continueButtonTextDisabled
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
    width: '80%',
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
    marginBottom: getSpacing(40, 50, 60),
    lineHeight: getFontSize(32, 36, 42),
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
    minHeight: getSpacing(60, 70, 80),
  },
  selectedOption: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 2,
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
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '700',
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
