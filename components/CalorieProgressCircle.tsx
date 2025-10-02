import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CalorieProgressCircleProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  backgroundColor?: string;
  textColor?: string;
  animationDuration?: number;
  showPercentage?: boolean;
  centerIcon?: string;
}

export default function CalorieProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  progressColor = '#22c55e', // Tailwind green-500
  backgroundColor = '#e5e7eb', // Tailwind gray-200
  textColor = '#374151', // Tailwind gray-700
  animationDuration = 1000,
  showPercentage = true,
  centerIcon = '🔥',
}: CalorieProgressCircleProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Animate progress when value changes
  useEffect(() => {
    const startTime = Date.now();
    const startProgress = animatedProgress;
    const targetProgress = progressPercentage;
    const duration = animationDuration;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut;
      
      setAnimatedProgress(currentProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [progressPercentage, animationDuration]);
  
  // Calculate stroke dash offset for current animated progress
  const strokeDashoffset = circumference - (circumference * animatedProgress) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        
        {/* Progress stroke */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`} // Start from top (12 o'clock)
        />
      </Svg>
      
      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={[styles.centerIcon, { fontSize: size * 0.15 }]}>
          {centerIcon}
        </Text>
        {showPercentage && (
          <Text style={[styles.percentageText, { 
            color: textColor, 
            fontSize: size * 0.08,
            marginTop: size * 0.01
          }]}>
            {Math.round(animatedProgress)}%
          </Text>
        )}
      </View>
    </View>
  );
}

// Example usage for the main macro section
export function MacroProgressSection() {
  const [calories, setCalories] = useState(684);
  const targetCalories = 2000;
  
  const handleAddCalories = (amount: number) => {
    setCalories(prev => Math.min(targetCalories, Math.max(0, prev + amount)));
  };

  return (
    <View style={macroStyles.container}>
      <Text style={macroStyles.title}>Daily Calorie Progress</Text>
      
      {/* Main Progress Circle */}
      <View style={macroStyles.circleContainer}>
        <CalorieProgressCircle
          value={calories}
          max={targetCalories}
          size={160}
          strokeWidth={14}
          progressColor="#22c55e"
          backgroundColor="#e5e7eb"
          textColor="#374151"
          animationDuration={1200}
        />
      </View>
      
      {/* Stats */}
      <View style={macroStyles.statsContainer}>
        <Text style={macroStyles.statsText}>
          {calories} / {targetCalories} calories
        </Text>
        <Text style={macroStyles.remainingText}>
          {targetCalories - calories} calories remaining
        </Text>
      </View>
      
      {/* Quick Actions */}
      <View style={macroStyles.actionsContainer}>
        <Text style={macroStyles.actionsTitle}>Quick Add:</Text>
        <View style={macroStyles.buttonRow}>
          {[100, 200, 300, 500].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={macroStyles.actionButton}
              onPress={() => handleAddCalories(amount)}
            >
              <Text style={macroStyles.actionButtonText}>+{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  centerIcon: {
    textAlign: 'center',
  },
  percentageText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

const macroStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  remainingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    alignItems: 'center',
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
