import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { getOnboardingRoute } from '../lib/onboarding';
import { wp, hp, rf, rs, getFontSize, getSpacing, getButtonHeight, getContainerPadding, isSmallScreen } from '../utils/responsive';

export default function HomeScreen() {
  const { profile } = useUser();
  const { user, loading, onboardingCompleted } = useAuth();

  useEffect(() => {
    const handleAuthenticatedUser = async () => {
      // For now, always start fresh - no auto-redirect
      console.log('User state:', { user: !!user, loading });
    };

    handleAuthenticatedUser();
  }, [user, loading]);

  const handleGetStarted = () => {
    console.log('Get Started pressed');
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleSkipAuth = () => {
    // Allow users to skip auth and go directly to onboarding
    router.push('gender');
  };

  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // Force reload to clear any cached state
    router.replace('/');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Phone Mockup */}
      <View style={styles.phoneContainer}>
        <View style={styles.phoneFrame}>
          <Image 
            source={require('../assets/image1.jpg')} 
            style={styles.phoneImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Fitly{'\n'}Calorie tracking made easy</Text>
        
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
        
        <View style={styles.signInContainer}>
          <Text style={styles.signInPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In Now</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom indicator */}
        <View style={styles.bottomIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: getContainerPadding().horizontal,
  },
  phoneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: getSpacing(40, 50, 60),
    paddingBottom: getSpacing(32, 36, 40),
  },
  phoneFrame: {
    width: isSmallScreen ? wp(70) : rs(280),
    height: isSmallScreen ? hp(50) : rs(560),
    borderRadius: rs(40),
    backgroundColor: '#000000',
    padding: rs(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  phoneImage: {
    width: '100%',
    height: '100%',
    borderRadius: rs(32),
  },
  contentContainer: {
    paddingBottom: getSpacing(40, 45, 50),
    alignItems: 'center',
  },
  title: {
    fontSize: getFontSize(28, 32, 38),
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: getSpacing(32, 36, 40),
    lineHeight: getFontSize(32, 36, 44),
  },
  getStartedButton: {
    backgroundColor: '#000000',
    paddingVertical: getSpacing(18, 20, 22),
    paddingHorizontal: getSpacing(50, 55, 60),
    borderRadius: rs(30),
    width: '100%',
    alignItems: 'center',
    marginBottom: getSpacing(20, 22, 25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minHeight: getButtonHeight(),
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: getFontSize(18, 19, 20),
    fontWeight: '700',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(24, 27, 30),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  signInPrompt: {
    fontSize: getFontSize(16, 17, 18),
    color: '#666666',
  },
  signInLink: {
    fontSize: getFontSize(16, 17, 18),
    color: '#000000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  bottomIndicator: {
    width: rs(40),
    height: rs(4),
    backgroundColor: '#000000',
    borderRadius: rs(2),
  },
  loadingText: {
    fontSize: getFontSize(16, 17, 18),
    color: '#666666',
    textAlign: 'center',
  },
});
