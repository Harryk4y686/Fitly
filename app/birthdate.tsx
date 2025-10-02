import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingGuard from '../components/OnboardingGuard';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';

export default function BirthdateScreen() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useUser();

  const handleContinue = async () => {
    if (selectedMonth && selectedDay && selectedYear && !isLoading) {
      setIsLoading(true);
      try {
        // Calculate age from birthdate
        const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        console.log('Saving age:', age, 'user authenticated:', !!user);
        
        if (user) {
          // Authenticated user - save to database
          console.log('Saving to database for user:', user.id);
          
          // Save age to database
          const result = await updateUserProfile(user.id, { age });
          
          if (result.error) {
            console.error('Failed to save age:', result.error);
            alert('Failed to save data. Please try again.');
            return;
          }
          
          console.log('Age saved successfully to database:', result.data);
        } else {
          // Unauthenticated user - save to local context
          console.log('Saving to local context (no auth)');
          updateProfile({ age });
        }
        
        router.push('/measurements');
      } catch (error) {
        console.error('Error saving age:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const canContinue = selectedMonth !== null && selectedDay !== null && selectedYear !== null && !isLoading;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2024 - i);

  const renderPicker = (
    options: (string | number)[],
    selectedValue: string | number | null,
    onSelect: (value: any) => void,
    isMonth: boolean = false
  ) => (
    <ScrollView 
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pickerContent}
    >
      {options.map((option, index) => {
        const value = isMonth ? index + 1 : option;
        const isSelected = selectedValue === value;
        
        return (
          <TouchableOpacity
            key={isMonth ? index : option}
            style={[
              styles.pickerItem,
              isSelected && styles.selectedPickerItem
            ]}
            onPress={() => onSelect(value)}
          >
            <Text style={[
              styles.pickerText,
              isSelected && styles.selectedPickerText
            ]}>
              {isMonth ? option : (typeof option === 'number' && option < 10 ? `0${option}` : option)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    // <OnboardingGuard step="birthdate">
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
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>
          This will be used to calibrate your custom plan.
        </Text>

        <View style={styles.pickersContainer}>
          <View style={styles.pickerColumn}>
            {renderPicker(months, selectedMonth, setSelectedMonth, true)}
          </View>
          
          <View style={styles.pickerColumn}>
            {renderPicker(days, selectedDay, setSelectedDay)}
          </View>
          
          <View style={styles.pickerColumn}>
            {renderPicker(years, selectedYear, setSelectedYear)}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue && styles.continueButtonTextDisabled
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
    width: '60%', // 3/5 progress
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
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: getSpacing(16, 18, 20),
    paddingHorizontal: rs(10),
  },
  picker: {
    flex: 1,
    maxHeight: isSmallScreen ? hp(25) : hp(30),
  },
  pickerItem: {
    paddingVertical: getSpacing(10, 12, 14),
    paddingHorizontal: getSpacing(12, 14, 16),
    marginVertical: rs(2),
    alignItems: 'center',
    borderRadius: rs(8),
  },
  selectedPickerItem: {
    backgroundColor: '#000000',
  },
  pickerText: {
    fontSize: getFontSize(14, 15, 16),
    color: '#999999',
    fontWeight: '500',
  },
  selectedPickerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: getFontSize(16, 17, 18),
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
  pickerContent: {
    paddingVertical: getSpacing(8, 10, 12),
  },
  pickerColumn: {
    flex: 1,
  },
});
