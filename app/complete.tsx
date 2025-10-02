import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';

export default function CompleteScreen() {
  const handleContinue = () => {
    router.push('loading');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/image3.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={16} color="#F5A623" />
            </View>
            <Text style={styles.completionText}>All done!</Text>
          </View>
          
          <Text style={styles.title}>Time to generate your custom plan!</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getContainerPadding().horizontal,
  },
  imageContainer: {
    marginBottom: getSpacing(40, 50, 60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: isSmallScreen ? wp(90) : wp(80),
    height: isSmallScreen ? hp(25) : hp(30),
    maxWidth: rs(450),
    maxHeight: rs(300),
  },
  messageContainer: {
    alignItems: 'center',
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(16, 18, 20),
  },
  checkmarkCircle: {
    width: rs(24),
    height: rs(24),
    borderRadius: rs(12),
    backgroundColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(10, 11, 12),
  },
  completionText: {
    fontSize: getFontSize(16, 17, 18),
    color: '#999999',
    fontWeight: '400',
  },
  title: {
    fontSize: getFontSize(32, 38, 46),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    maxWidth: isSmallScreen ? wp(90) : rs(500),
    lineHeight: getFontSize(36, 42, 50),
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
  continueButtonText: {
    color: '#ffffff',
    fontSize: getFontSize(16, 17, 18),
    fontWeight: '700',
  },
});
