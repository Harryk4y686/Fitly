import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function WorkoutScreen() {
  const { updateProfile } = useUser();
  const [selectedWorkout, setSelectedWorkout] = useState<'sedentary' | 'light' | 'active' | null>(null);

  const handleContinue = () => {
    if (selectedWorkout) {
      updateProfile({ activityLevel: selectedWorkout });
      router.push('/onboarding/birthdate');
    }
  };

  const workoutOptions: Array<{ 
    id: 'sedentary' | 'light' | 'active'; 
    title: string; 
    subtitle: string;
    icon: string;
  }> = [
    { 
      id: 'sedentary', 
      title: '0 - 2', 
      subtitle: 'Workouts now and then',
      icon: '●'
    },
    { 
      id: 'light', 
      title: '3 - 5', 
      subtitle: 'A few workouts per week',
      icon: '●●'
    },
    { 
      id: 'active', 
      title: '6+', 
      subtitle: 'Dedicated athlete',
      icon: '●●●●'
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
        <Text style={styles.title}>How many workouts do you do per week?</Text>
        <Text style={styles.subtitle}>This will be used to calibrate your custom plan.</Text>

        <View style={styles.optionsContainer}>
          {workoutOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedWorkout === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedWorkout(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  <Text style={[
                    styles.optionIcon,
                    selectedWorkout === option.id && styles.selectedOptionIcon
                  ]}>
                    {option.icon}
                  </Text>
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
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedWorkout && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedWorkout}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedWorkout && styles.continueButtonTextDisabled
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
    width: '50%', // Step 2 of 4
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
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 16,
    color: '#ccc',
    letterSpacing: 2,
  },
  selectedOptionIcon: {
    color: '#000000',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#000000',
  },
  selectedOptionSubtitle: {
    color: '#000000',
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
