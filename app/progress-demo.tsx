import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AnimatedProgressCircle from '../components/AnimatedProgressCircle';

export default function ProgressDemoScreen() {
  const [demoState, setDemoState] = useState(0);
  
  const demoStates = [
    { caloriesLeft: 2000, caloriesTarget: 2000, label: '0% Progress (Full calories left)' },
    { caloriesLeft: 1500, caloriesTarget: 2000, label: '25% Progress (1500 left)' },
    { caloriesLeft: 1000, caloriesTarget: 2000, label: '50% Progress (1000 left)' },
    { caloriesLeft: 500, caloriesTarget: 2000, label: '75% Progress (500 left)' },
    { caloriesLeft: 0, caloriesTarget: 2000, label: '100% Progress (0 left)' },
    { caloriesLeft: -200, caloriesTarget: 2000, label: 'Over target (200 over)' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoState((prev) => (prev + 1) % demoStates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentDemo = demoStates[demoState];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Progress Circle Demo</Text>
        </View>

        <Text style={styles.subtitle}>Animated Calorie Progress Circle</Text>
        <Text style={styles.description}>
          Circle starts from 12 o'clock position and fills clockwise as calories are consumed.
        </Text>

        {/* Main Demo */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoLabel}>{currentDemo.label}</Text>
          <AnimatedProgressCircle
            caloriesLeft={currentDemo.caloriesLeft}
            caloriesTarget={currentDemo.caloriesTarget}
            size={150}
            strokeWidth={12}
            progressColor="#333333"
            backgroundColor="#f0f0f0"
            textColor="#333333"
            animationDuration={1500}
          />
          <Text style={styles.demoStats}>
            Target: {currentDemo.caloriesTarget} cal | Left: {currentDemo.caloriesLeft} cal
          </Text>
        </View>

        {/* Different Sizes */}
        <Text style={styles.sectionTitle}>Different Sizes</Text>
        <View style={styles.sizesContainer}>
          <View style={styles.sizeDemo}>
            <AnimatedProgressCircle
              caloriesLeft={800}
              caloriesTarget={2000}
              size={80}
              strokeWidth={6}
              progressColor="#FF6B6B"
              animationDuration={800}
            />
            <Text style={styles.sizeLabel}>Small (80px)</Text>
          </View>
          
          <View style={styles.sizeDemo}>
            <AnimatedProgressCircle
              caloriesLeft={600}
              caloriesTarget={2000}
              size={100}
              strokeWidth={8}
              progressColor="#4ECDC4"
              animationDuration={800}
            />
            <Text style={styles.sizeLabel}>Medium (100px)</Text>
          </View>
          
          <View style={styles.sizeDemo}>
            <AnimatedProgressCircle
              caloriesLeft={400}
              caloriesTarget={2000}
              size={120}
              strokeWidth={10}
              progressColor="#45B7D1"
              animationDuration={800}
            />
            <Text style={styles.sizeLabel}>Large (120px)</Text>
          </View>
        </View>

        {/* Different Colors */}
        <Text style={styles.sectionTitle}>Different Colors</Text>
        <View style={styles.colorsContainer}>
          <AnimatedProgressCircle
            caloriesLeft={1000}
            caloriesTarget={2000}
            size={100}
            strokeWidth={8}
            progressColor="#FF6B6B"
            backgroundColor="#FFE5E5"
            textColor="#FF6B6B"
            animationDuration={800}
          />
          
          <AnimatedProgressCircle
            caloriesLeft={1000}
            caloriesTarget={2000}
            size={100}
            strokeWidth={8}
            progressColor="#4ECDC4"
            backgroundColor="#E5F9F7"
            textColor="#4ECDC4"
            animationDuration={800}
          />
          
          <AnimatedProgressCircle
            caloriesLeft={1000}
            caloriesTarget={2000}
            size={100}
            strokeWidth={8}
            progressColor="#45B7D1"
            backgroundColor="#E5F4FD"
            textColor="#45B7D1"
            animationDuration={800}
          />
        </View>

        {/* Manual Controls */}
        <Text style={styles.sectionTitle}>Manual Controls</Text>
        <View style={styles.controlsContainer}>
          {demoStates.map((state, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.controlButton,
                demoState === index && styles.controlButtonActive
              ]}
              onPress={() => setDemoState(index)}
            >
              <Text style={[
                styles.controlButtonText,
                demoState === index && styles.controlButtonTextActive
              ]}>
                {Math.round(((state.caloriesTarget - state.caloriesLeft) / state.caloriesTarget) * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  demoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  demoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  demoStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  sizesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  sizeDemo: {
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  controlButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  controlButtonTextActive: {
    color: '#fff',
  },
});
