import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalories } from '../../contexts/CalorieContext';

export default function ProgressScreen() {
  const { meals, totalCalories, dailyGoal } = useCalories();

  // Calculate weekly progress
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dayMeals = meals.filter(meal => 
        meal.timestamp.toDateString() === date.toDateString()
      );
      
      const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      
      weeklyData.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        calories: dayCalories,
        percentage: Math.min(100, (dayCalories / dailyGoal) * 100)
      });
    }
    
    return weeklyData;
  };

  const weeklyProgress = getWeeklyProgress();
  const averageCalories = Math.round(weeklyProgress.reduce((sum, day) => sum + day.calories, 0) / 7);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your weekly journey</Text>
        </View>

        {/* Weekly Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{averageCalories}</Text>
              <Text style={styles.statLabel}>Avg Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{meals.length}</Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {weeklyProgress.filter(day => day.calories > 0).length}
              </Text>
              <Text style={styles.statLabel}>Active Days</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <View style={styles.chart}>
            {weeklyProgress.map((day, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { height: `${Math.max(5, day.percentage)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.calorieLabel}>{day.calories}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.recentMealsCard}>
          <Text style={styles.cardTitle}>Recent Meals</Text>
          {meals.length > 0 ? (
            <View style={styles.mealsList}>
              {meals.slice(-5).reverse().map((meal) => (
                <View key={meal.id} style={styles.mealItem}>
                  <View style={styles.mealIcon}>
                    {meal.image ? (
                      <Image 
                        source={{ uri: meal.image }} 
                        style={styles.mealImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.mealEmoji}>🍽️</Text>
                    )}
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealTime}>
                      {meal.timestamp.toLocaleDateString()} • {meal.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                  <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Start tracking to see your progress</Text>
            </View>
          )}
        </View>

        {/* Goals */}
        <View style={styles.goalsCard}>
          <Text style={styles.cardTitle}>Daily Goals</Text>
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Calories</Text>
              <Text style={styles.goalProgress}>{totalCalories} / {dailyGoal}</Text>
            </View>
            <View style={styles.goalBar}>
              <View 
                style={[
                  styles.goalBarFill, 
                  { width: `${Math.min(100, (totalCalories / dailyGoal) * 100)}%` }
                ]} 
              />
            </View>
          </View>
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
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    width: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  bar: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: '100%',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calorieLabel: {
    fontSize: 10,
    color: '#999',
  },
  recentMealsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealsList: {
    gap: 15,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  mealEmoji: {
    fontSize: 18,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  goalsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalItem: {
    marginBottom: 15,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
  goalBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});
