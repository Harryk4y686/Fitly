import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ensureUserProfilesExist } from '../lib/auth-helpers';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateOnboardingStatus: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('=== AUTH CONTEXT INITIALIZING ===');
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('Initial session result:', { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        error 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Ensure profiles exist for existing session
      if (session?.user) {
        console.log('Initial session found, ensuring profiles exist...');
        const result = await ensureUserProfilesExist();
        if (!result.success) {
          console.error('Failed to ensure profiles exist for initial session:', result.error);
        }
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', { 
        event, 
        hasSession: !!session, 
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Ensure profiles exist when user signs in
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, ensuring profiles exist...');
        const result = await ensureUserProfilesExist();
        if (!result.success) {
          console.error('Failed to ensure profiles exist after sign in:', result.error);
        }
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Auth context cleanup');
      subscription.unsubscribe();
    };
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log('User state changed:', { 
      hasUser: !!user, 
      userId: user?.id, 
      email: user?.email,
      loading 
    });
  }, [user, loading]);

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('Sign up attempt:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    console.log('Sign up result:', { hasUser: !!data.user, error });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Sign in attempt:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Sign in result:', { 
      hasUser: !!data.user, 
      hasSession: !!data.session,
      userId: data.user?.id,
      error 
    });
    return { error };
  };

  const signOut = async () => {
    console.log('Sign out attempt');
    const { error } = await supabase.auth.signOut();
    console.log('Sign out result:', { error });
    return { error };
  };

  const resetPassword = async (email: string) => {
    console.log('Reset password attempt:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    console.log('Reset password result:', { error });
    return { error };
  };

  const updateOnboardingStatus = (completed: boolean) => {
    setOnboardingCompleted(completed);
  };

  const value = {
    user,
    session,
    loading,
    onboardingCompleted,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
