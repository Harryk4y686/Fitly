import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function QuickTestScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const runQuickTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Starting quick diagnostic...');

      // Test 1: Check environment variables
      addResult(`📊 Supabase URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
      addResult(`🔑 Supabase Key: ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

      // Test 2: Check if supabase client works
      try {
        addResult('🔌 Testing Supabase client initialization...');
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
        
        if (error) {
          addResult(`❌ Supabase client error: ${error.message}`);
          addResult(`🔍 Error code: ${error.code}`);
          addResult(`🔍 Error details: ${error.details}`);
        } else {
          addResult('✅ Supabase client working');
        }
      } catch (err: any) {
        addResult(`❌ Supabase client exception: ${err.message}`);
      }

      // Test 3: Check auth state
      try {
        addResult('👤 Checking authentication state...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          addResult(`ℹ️ Auth error (may be normal): ${authError.message}`);
        } else if (user) {
          addResult(`✅ User authenticated: ${user.email}`);
          addResult(`👤 User ID: ${user.id}`);
        } else {
          addResult('ℹ️ No authenticated user (expected if not logged in)');
        }
      } catch (err: any) {
        addResult(`❌ Auth check exception: ${err.message}`);
      }

      // Test 4: Test basic query permissions
      try {
        addResult('🔐 Testing query permissions...');
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);
        
        if (error) {
          addResult(`❌ Query permission error: ${error.message}`);
          if (error.code === '42P01') {
            addResult('🔍 Table does not exist - check database schema');
          } else if (error.code === '42501') {
            addResult('🔍 Permission denied - check RLS policies');
          }
        } else {
          addResult('✅ Query permissions working');
        }
      } catch (err: any) {
        addResult(`❌ Query exception: ${err.message}`);
      }

      addResult('🏁 Quick diagnostic completed!');

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Auto-run test when component mounts
    runQuickTest();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Quick Test</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runQuickTest}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running...' : 'Run Test Again'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.results}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/debug-db')}
        >
          <Text style={styles.actionButtonText}>Full Debug Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.actionButtonText}>Go to Login</Text>
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
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  results: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
