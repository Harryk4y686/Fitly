import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function DebugProfileScreen() {
  const { user } = useAuth();
  const { profile } = useUser();

  const handleContinueToLoading = () => {
    router.push('/loading');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Profile Debug Screen</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Authentication:</Text>
          <Text style={styles.text}>User ID: {user?.id || 'Not found'}</Text>
          <Text style={styles.text}>Email: {user?.email || 'Not found'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Data:</Text>
          <Text style={styles.code}>{JSON.stringify(profile, null, 2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Field Validation:</Text>
          <Text style={[styles.text, profile?.gender ? styles.valid : styles.invalid]}>
            Gender: {profile?.gender || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.age ? styles.valid : styles.invalid]}>
            Age: {profile?.age || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.weight ? styles.valid : styles.invalid]}>
            Weight: {profile?.weight || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.height ? styles.valid : styles.invalid]}>
            Height: {profile?.height || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.activityLevel ? styles.valid : styles.invalid]}>
            Activity Level: {profile?.activityLevel || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.goal ? styles.valid : styles.invalid]}>
            Goal: {profile?.goal || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.dietPreference ? styles.valid : styles.invalid]}>
            Diet Preference: {profile?.dietPreference || 'MISSING'}
          </Text>
          <Text style={[styles.text, profile?.isOnboardingComplete ? styles.valid : styles.invalid]}>
            Onboarding Complete: {profile?.isOnboardingComplete ? 'YES' : 'NO'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleContinueToLoading}>
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Continue to Loading</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    color: '#333',
  },
  valid: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  invalid: {
    color: '#F44336',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: '#fff',
  },
});
