import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function DietScreen() {
  const { updateProfile } = useUser();
  const [selectedDiet, setSelectedDiet] = useState<'classic' | 'pescatarian' | 'vegetarian' | 'vegan' | null>(null);

  const handleContinue = () => {
    if (selectedDiet) {
      updateProfile({ dietPreference: selectedDiet });
      router.push('/onboarding/goals');
    }
  };

  const dietOptions: Array<{ 
    id: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan'; 
    label: string;
    icon: string;
  }> = [
    { 
      id: 'classic', 
      label: 'Classic',
      icon: '🍗'
    },
    { 
      id: 'pescatarian', 
      label: 'Pescatarian',
      icon: '🐟'
    },
    { 
      id: 'vegetarian', 
      label: 'Vegetarian',
      icon: '🍎'
    },
    { 
      id: 'vegan', 
      label: 'Vegan',
      icon: '🌱'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
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
                <View style={styles.iconContainer}>
                  <Text style={styles.optionIcon}>
                    {option.icon}
                  </Text>
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
            !selectedDiet && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDiet}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedDiet && styles.continueButtonTextDisabled
          ]}>
            Continue
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
    width: '90%', // Almost complete
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
    marginBottom: 60,
    lineHeight: 38,
  },
  optionsContainer: {
    gap: 15,
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
  selectedOption: {
    borderColor: '#000000',
    backgroundColor: '#f0f4ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: '#000000',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#ccc',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#999',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
