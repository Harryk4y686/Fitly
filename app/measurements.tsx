import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingGuard from '../components/OnboardingGuard';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';

export default function MeasurementsScreen() {
  const [isImperial, setIsImperial] = useState(true);
  const [selectedHeightFt, setSelectedHeightFt] = useState<number | null>(null);
  const [selectedHeightIn, setSelectedHeightIn] = useState<number | null>(null);
  const [selectedHeightCm, setSelectedHeightCm] = useState<number | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useUser();

  const handleContinue = async () => {
    if (canContinue && !isLoading) {
      setIsLoading(true);
      try {
        let heightCm: number;
        let weightKg: number;

        if (isImperial) {
          // Convert feet/inches to cm
          heightCm = ((selectedHeightFt! * 12) + selectedHeightIn!) * 2.54;
          // Convert lbs to kg
          weightKg = selectedWeight! * 0.453592;
        } else {
          heightCm = selectedHeightCm!;
          weightKg = selectedWeight!;
        }

        console.log('Saving measurements:', { heightCm, weightKg }, 'user authenticated:', !!user);
        
        if (user) {
          // Authenticated user - save to database
          console.log('Saving to database for user:', user.id);
          
          // Save measurements to database
          const result = await updateUserProfile(user.id, { 
            height_cm: heightCm, 
            weight_kg: weightKg 
          });
          
          if (result.error) {
            console.error('Failed to save measurements:', result.error);
            alert('Failed to save data. Please try again.');
            return;
          }
          
          console.log('Measurements saved successfully to database:', result.data);
        } else {
          // Unauthenticated user - save to local context
          console.log('Saving to local context (no auth)');
          updateProfile({ height: heightCm, weight: weightKg });
        }
        
        router.push('/diet');
      } catch (error) {
        console.error('Error saving measurements:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const canContinue = (isImperial 
    ? selectedHeightFt !== null && selectedHeightIn !== null && selectedWeight !== null
    : selectedHeightCm !== null && selectedWeight !== null) && !isLoading;

  const feetOptions = Array.from({ length: 5 }, (_, i) => i + 3);
  const inchOptions = Array.from({ length: 12 }, (_, i) => i);
  const cmOptions = Array.from({ length: 101 }, (_, i) => i + 120);
  const lbsOptions = Array.from({ length: 184 }, (_, i) => i + 80);
  const kgOptions = Array.from({ length: 101 }, (_, i) => i + 40);

  const renderPicker = (
    options: number[],
    selectedValue: number | null,
    onSelect: (value: number) => void,
    suffix: string
  ) => (
    <ScrollView 
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pickerContent}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.pickerItem,
            selectedValue === option && styles.selectedPickerItem
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={[
            styles.pickerText,
            selectedValue === option && styles.selectedPickerText
          ]}>
            {option} {suffix}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
        <Text style={styles.title}>Height & weight</Text>
        <Text style={styles.subtitle}>
          This will be used to calibrate your custom plan.
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isImperial && styles.activeToggle]}
            onPress={() => setIsImperial(true)}
          >
            <Text style={[styles.toggleText, isImperial && styles.activeToggleText]}>
              Imperial
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isImperial && styles.activeToggle]}
            onPress={() => setIsImperial(false)}
          >
            <Text style={[styles.toggleText, !isImperial && styles.activeToggleText]}>
              Metric
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.labelsContainer}>
          <Text style={styles.sectionLabel}>Height</Text>
          <Text style={styles.sectionLabel}>Weight</Text>
        </View>

        <View style={styles.pickersContainer}>
          {isImperial ? (
            <>
              <View style={styles.heightContainer}>
                {renderPicker(feetOptions, selectedHeightFt, setSelectedHeightFt, 'ft')}
                {renderPicker(inchOptions, selectedHeightIn, setSelectedHeightIn, 'in')}
              </View>
              <View style={styles.weightContainer}>
                {renderPicker(lbsOptions, selectedWeight, setSelectedWeight, 'lb')}
              </View>
            </>
          ) : (
            <>
              <View style={styles.heightContainer}>
                {renderPicker(cmOptions, selectedHeightCm, setSelectedHeightCm, 'cm')}
              </View>
              <View style={styles.weightContainer}>
                {renderPicker(kgOptions, selectedWeight, setSelectedWeight, 'kg')}
              </View>
            </>
          )}
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
    width: '75%',
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
    marginBottom: getSpacing(32, 36, 40),
    lineHeight: getFontSize(20, 22, 24),
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: rs(30),
    padding: rs(4),
    marginBottom: getSpacing(32, 36, 40),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: getSpacing(12, 14, 16),
    alignItems: 'center',
    borderRadius: rs(26),
  },
  activeToggle: {
    backgroundColor: '#000000',
  },
  toggleText: {
    fontSize: getFontSize(14, 15, 16),
    color: '#999999',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  labelsContainer: {
    flexDirection: 'row',
    marginBottom: getSpacing(16, 18, 20),
  },
  sectionLabel: {
    flex: 1,
    fontSize: getFontSize(14, 15, 16),
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left',
    paddingLeft: rs(10),
  },
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: getSpacing(16, 18, 20),
    paddingHorizontal: rs(10),
  },
  heightContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: rs(10),
  },
  weightContainer: {
    flex: 1,
  },
  picker: {
    flex: 1,
    maxHeight: isSmallScreen ? hp(25) : hp(30),
  },
  pickerContent: {
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
});
