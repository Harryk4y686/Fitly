import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<boolean[]>([false, false, false, false, false]);
  const progressAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  const navigateToResults = () => {
    router.replace('/onboarding/results');
  };

  const recommendations = [
    'Calories',
    'Carbs', 
    'Protein',
    'Fats',
    'Health score'
  ];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress animation - faster completion
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Navigate to results after completion
          setTimeout(() => {
            navigateToResults();
          }, 500);
          return 100;
        }
        return prev + 4; // Increment by 4% every 80ms for faster completion
      });
    }, 80);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds total to match faster progress
      useNativeDriver: false,
    }).start();

    // Animate checklist items
    const itemInterval = setInterval(() => {
      setCompletedItems(prev => {
        const nextIndex = prev.findIndex(item => !item);
        if (nextIndex === -1) {
          clearInterval(itemInterval);
          return prev;
        }
        const newItems = [...prev];
        newItems[nextIndex] = true;
        return newItems;
      });
    }, 1000); // Complete one item every second

    return () => {
      clearInterval(progressInterval);
      clearInterval(itemInterval);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.touchableContainer} 
        onPress={navigateToResults}
        activeOpacity={1}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Progress Percentage */}
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{progress}%</Text>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>We're setting everything up for you</Text>
          </View>

          {/* Animated Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  { width: progressWidth }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>Finalizing results...</Text>
          </View>

          {/* Daily Recommendations Checklist */}
          <View style={styles.checklistContainer}>
            <Text style={styles.checklistTitle}>Daily recommendation for</Text>
            
            <View style={styles.checklistItems}>
              {recommendations.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{item}</Text>
                  <View style={[
                    styles.checkmark,
                    completedItems[index] && styles.checkmarkCompleted
                  ]}>
                    {completedItems[index] && (
                      <Text style={styles.checkmarkText}>✓</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Skip hint */}
          <Text style={styles.skipHint}>Tap anywhere to skip</Text>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  touchableContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  percentageContainer: {
    marginBottom: 40,
  },
  percentage: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
  },
  titleContainer: {
    marginBottom: 60,
    maxWidth: 280,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  checklistContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
  },
  checklistItems: {
    gap: 15,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: 16,
    color: '#94a3b8',
    marginRight: 12,
    width: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCompleted: {
    backgroundColor: '#3b82f6',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skipHint: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
