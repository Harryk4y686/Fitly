import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function MeasurementsScreen() {
  const { updateProfile } = useUser();
  const [isImperial, setIsImperial] = useState(true);
  const [selectedHeightFt, setSelectedHeightFt] = useState<number | null>(null);
  const [selectedHeightIn, setSelectedHeightIn] = useState<number | null>(null);
  const [selectedHeightCm, setSelectedHeightCm] = useState<number | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  const handleContinue = () => {
    let height: number;
    let weight: number;

    if (isImperial) {
      // Convert feet and inches to cm
      height = ((selectedHeightFt || 0) * 12 + (selectedHeightIn || 0)) * 2.54;
      weight = (selectedWeight || 0) * 0.453592; // Convert lbs to kg
    } else {
      height = selectedHeightCm || 0;
      weight = selectedWeight || 0;
    }

    updateProfile({ height, weight });
    router.push('/onboarding/diet');
  };

  const canContinue = isImperial 
    ? selectedHeightFt !== null && selectedHeightIn !== null && selectedWeight !== null
    : selectedHeightCm !== null && selectedWeight !== null;

  // Generate height options
  const feetOptions = Array.from({ length: 5 }, (_, i) => i + 3); // 3-7 ft
  const inchOptions = Array.from({ length: 12 }, (_, i) => i); // 0-11 in
  const cmOptions = Array.from({ length: 101 }, (_, i) => i + 120); // 120-220 cm
  
  // Generate weight options
  const lbsOptions = Array.from({ length: 184 }, (_, i) => i + 80); // 80-263 lbs
  const kgOptions = Array.from({ length: 101 }, (_, i) => i + 40); // 40-140 kg

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
        <Text style={styles.title}>Height & Weight</Text>
        <Text style={styles.subtitle}>
          This will be taken into account when calculating your daily nutrition goals.
        </Text>

        {/* Imperial/Metric Toggle */}
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

        {/* Height and Weight Labels */}
        <View style={styles.labelsContainer}>
          <Text style={styles.sectionLabel}>Height</Text>
          <Text style={styles.sectionLabel}>Weight</Text>
        </View>

        {/* Pickers Container */}
        <View style={styles.pickersContainer}>
          {isImperial ? (
            <>
              {/* Imperial Height Pickers */}
              <View style={styles.heightContainer}>
                {renderPicker(feetOptions, selectedHeightFt, setSelectedHeightFt, 'ft')}
                {renderPicker(inchOptions, selectedHeightIn, setSelectedHeightIn, 'in')}
              </View>
              {/* Imperial Weight Picker */}
              <View style={styles.weightContainer}>
                {renderPicker(lbsOptions, selectedWeight, setSelectedWeight, 'lb')}
              </View>
            </>
          ) : (
            <>
              {/* Metric Height Picker */}
              <View style={styles.heightContainer}>
                {renderPicker(cmOptions, selectedHeightCm, setSelectedHeightCm, 'cm')}
              </View>
              {/* Metric Weight Picker */}
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
    width: '75%', // Step 3 of 4
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
    marginBottom: 30,
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#333',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  labelsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 20,
  },
  heightContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  weightContainer: {
    flex: 1,
  },
  picker: {
    flex: 1,
    maxHeight: 300,
  },
  pickerContent: {
    paddingVertical: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: '#000000',
  },
  pickerText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPickerText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
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
