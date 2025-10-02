import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const { updateProfile, completeOnboarding } = useUser();
  const [selectedGoal, setSelectedGoal] = useState<'lose_weight' | 'maintain_weight' | 'gain_weight' | null>(null);

  const handleContinue = () => {
    if (selectedGoal) {
      updateProfile({ goal: selectedGoal });
      router.push('/onboarding/complete');
    }
  };

  const goalOptions: Array<{ 
    id: 'lose_weight' | 'maintain_weight' | 'gain_weight'; 
    label: string;
  }> = [
    { id: 'lose_weight', label: 'Lose Weight' },
    { id: 'maintain_weight', label: 'Maintain Weight' },
    { id: 'gain_weight', label: 'Gain Weight' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
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
                selectedGoal === option.id && styles.selectedOption,
                index === 0 && styles.firstOption
              ]}
              onPress={() => setSelectedGoal(option.id)}
            >
              <Text style={[
                styles.optionText,
                (selectedGoal === option.id || index === 0) && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGoal && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedGoal && styles.continueButtonTextDisabled
          ]}>
            Complete Setup
          </Text>
        </TouchableOpacity>
      </View>
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
  progressFill: {
    width: '100%', // Final step
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 60,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 15,
    marginTop: 100,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  firstOption: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
