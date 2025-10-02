import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface AnimatedProgressCircleProps {
  caloriesLeft: number;
  caloriesTarget: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  backgroundColor?: string;
  textColor?: string;
  animationDuration?: number;
  showPercentage?: boolean;
  centerIcon?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedProgressCircle({
  caloriesLeft,
  caloriesTarget,
  size = 120,
  strokeWidth = 8,
  progressColor = '#000000',
  backgroundColor = '#f0f0f0',
  textColor = '#333333',
  animationDuration = 1000,
  showPercentage = true,
  centerIcon = '🔥',
}: AnimatedProgressCircleProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);
  
  // Calculate progress percentage
  const consumedCalories = Math.max(0, caloriesTarget - caloriesLeft);
  const progressPercentage = Math.min(100, (consumedCalories / caloriesTarget) * 100);
  
  // Circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate stroke dash offset for progress (starts from top, goes clockwise)
  const strokeDashoffset = circumference - (circumference * progressPercentage) / 100;

  useEffect(() => {
    // Reset animation value and animate to new progress
    animatedValue.setValue(0);
    
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressPercentage, animationDuration]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      if (circleRef.current) {
        const currentOffset = circumference - (circumference * value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset: currentOffset,
        });
      }
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [circumference]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <AnimatedCircle
          ref={circleRef}
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
        <Text style={[styles.fireIcon, { fontSize: size * 0.2 }]}>{centerIcon}</Text>
        {showPercentage && (
          <Text style={[styles.progressText, { color: textColor, fontSize: size * 0.1 }]}>
            {Math.round(progressPercentage)}%
          </Text>
        )}
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
  fireIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
