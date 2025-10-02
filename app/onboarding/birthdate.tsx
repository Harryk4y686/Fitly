import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function BirthdateScreen() {
  const { updateProfile } = useUser();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedMonth && selectedDay && selectedYear) {
      const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const age = new Date().getFullYear() - selectedYear;
      updateProfile({ age });
      router.push('/onboarding/measurements');
    }
  };

  const canContinue = selectedMonth !== null && selectedDay !== null && selectedYear !== null;

  // Generate options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2024 - i); // 2024 down to 1945

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
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>
          This will be taken into account when calculating your daily nutrition goals.
        </Text>

        {/* Date Pickers Container */}
        <View style={styles.pickersContainer}>
          {/* Month Picker */}
          <View style={styles.pickerColumn}>
            {renderPicker(months, selectedMonth, setSelectedMonth, true)}
          </View>
          
          {/* Day Picker */}
          <View style={styles.pickerColumn}>
            {renderPicker(days, selectedDay, setSelectedDay)}
          </View>
          
          {/* Year Picker */}
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
    width: '60%', // Step between workout and measurements
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
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  pickerColumn: {
    flex: 1,
  },
  picker: {
    flex: 1,
    maxHeight: 400,
  },
  pickerContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickerItem: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 3,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: '#000000',
  },
  pickerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
