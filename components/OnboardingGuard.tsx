import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { canAccessStep, getOnboardingRoute, OnboardingStepName } from '../lib/onboarding';

interface OnboardingGuardProps {
  children: React.ReactNode;
  step: OnboardingStepName;
  fallbackRoute?: string;
}

export default function OnboardingGuard({ 
  children, 
  step, 
  fallbackRoute 
}: OnboardingGuardProps) {
  const { user, loading } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || loading) {
        setChecking(false);
        return;
      }

      try {
        const hasAccess = await canAccessStep(user.id, step);
        
        if (!hasAccess) {
          // Redirect to the correct step or fallback route
          const correctRoute = fallbackRoute || await getOnboardingRoute(user.id);
          router.replace(correctRoute);
          return;
        }

        setCanAccess(hasAccess);
      } catch (error) {
        console.error('Error checking onboarding access:', error);
        // On error, redirect to gender (safe fallback)
        router.replace('/gender');
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [user, loading, step, fallbackRoute]);

  // Show loading while checking
  if (loading || checking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't render if access is denied (redirect is happening)
  if (canAccess === false) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
