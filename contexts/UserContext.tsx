import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  gender: 'female' | 'male' | 'other' | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  dietPreference: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan' | null;
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | null;
  isOnboardingComplete: boolean;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  gender: null,
  age: null,
  weight: null,
  height: null,
  activityLevel: null,
  dietPreference: null,
  goal: null,
  isOnboardingComplete: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile from storage on app start
  useEffect(() => {
    loadProfile();
  }, []);

  // Save profile to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveProfile();
    }
  }, [profile, isLoaded]);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setProfile(prev => ({ ...prev, isOnboardingComplete: true }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <UserContext.Provider value={{
      profile,
      updateProfile,
      completeOnboarding,
      resetProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
