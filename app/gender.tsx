import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingGuard from '../components/OnboardingGuard';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { updateUserProfile } from '../lib/database';
import { testDatabaseConnection } from '../lib/auth-helpers';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding } from '../utils/responsive';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | 'other' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { updateProfile } = useUser();

  // Debug authentication state
  React.useEffect(() => {
    console.log('=== GENDER PAGE AUTH DEBUG ===');
    console.log('Auth loading:', loading);
    console.log('User object:', user);
    console.log('User ID:', user?.id);
    console.log('User email:', user?.email);
  }, [user, loading]);

  // Test database connection when component mounts
  React.useEffect(() => {
    const runDatabaseTest = async () => {
      if (user && !loading) {
        console.log('=== RUNNING DATABASE CONNECTION TEST ===');
        const result = await testDatabaseConnection();
        
        if (result.success) {
          console.log('✅ Database connection test passed');
        } else {
          console.error('❌ Database connection test failed:', result.error);
          console.error('Failed at step:', result.step);
        }
      }
    };

    runDatabaseTest();
  }, [user, loading]);

  const handleContinue = async () => {
    if (selectedGender && !isLoading) {
      setIsLoading(true);
      try {
        console.log('=== SAVE ATTEMPT ===');
        console.log('Selected gender:', selectedGender);
        console.log('Auth loading:', loading);
        console.log('User authenticated:', !!user);
        console.log('User ID:', user?.id);
        
        // Wait for auth to finish loading if still loading
        if (loading) {
          console.log('Auth still loading, waiting...');
          // Wait a bit for auth to complete
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('Final user check:', !!user);
        
        if (user) {
          // Authenticated user - save to database
          console.log('Saving to database for user:', user.id);
          
          // Save gender to database using the safe update function
          const result = await updateUserProfile(user.id, { gender: selectedGender });
          
          if (result.error) {
            console.error('Failed to save gender:', result.error);
            alert('Failed to save data. Please try again.');
            return;
          }
          
          console.log('Gender saved successfully to database:', result.data);
        } else {
          // Unauthenticated user - save to local context
          console.log('Saving to local context (no auth)');
          updateProfile({ gender: selectedGender });
        }
        
        router.push('/workout');
      } catch (error) {
        console.error('Error saving gender:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };



  const genderOptions: Array<{ id: 'female' | 'male' | 'other'; label: string }> = [
    { id: 'female', label: 'Female' },
    { id: 'male', label: 'Male' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
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

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose your Gender</Text>
        <Text style={styles.subtitle}>This will be used to calibrate your custom plan.</Text>

        <View style={styles.optionsContainer}>
          {/* Male Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'male' && styles.selectedCardBlack
            ]}
            onPress={() => setSelectedGender('male')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'male' && styles.selectedText
            ]}>
              Male
            </Text>
          </TouchableOpacity>

          {/* Female Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'female' && styles.selectedCardBlack
            ]}
            onPress={() => setSelectedGender('female')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'female' && styles.selectedText
            ]}>
              Female
            </Text>
          </TouchableOpacity>

          {/* Other Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedGender === 'other' && styles.selectedCardBlack
            ]}
            onPress={() => setSelectedGender('other')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'other' && styles.selectedText
            ]}>
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedGender || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedGender || isLoading}
        >
          <Text style={styles.continueButtonText}>
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
    width: '20%', // 1/5 progress
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
    color: '#666',
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
    alignItems: 'center',
    minHeight: getSpacing(60, 70, 80),
  },
  selectedOption: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 2,
  },
  optionText: {
    fontSize: getFontSize(16, 17, 18),
    color: '#000000',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  optionCard: {
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
    alignItems: 'center',
    minHeight: getSpacing(60, 70, 80),
  },
  selectedCardBlack: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 2,
  },
  selectedText: {
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
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
