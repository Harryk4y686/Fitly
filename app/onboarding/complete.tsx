import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function CompleteScreen() {
  const { completeOnboarding } = useUser();

  useEffect(() => {
    // Mark onboarding as complete when this screen loads
    completeOnboarding();
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/loading');
  };

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
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/image3.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Completion Message */}
        <View style={styles.messageContainer}>
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={16} color="#F5A623" />
            </View>
            <Text style={styles.completionText}>All done!</Text>
          </View>
          
          <Text style={styles.title}>Time to generate{'\n'}your custom plan!</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
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
    width: '100%', // Complete!
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: 450,
    height: 300,
  },
  messageContainer: {
    alignItems: 'center',
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  completionText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '400',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 40,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 22,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
