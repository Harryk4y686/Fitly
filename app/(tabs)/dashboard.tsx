import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCalories } from '../../contexts/CalorieContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { getUserProfile, UserProfile as DatabaseUserProfile } from '../../lib/database';
import { router } from 'expo-router';
import AnimatedProgressCircle from '../../components/AnimatedProgressCircle';

export default function DashboardScreen() {
  const { totalCalories, totalProtein, totalCarbs, totalFat, dailyGoal, meals } = useCalories();
  const [userProfile, setUserProfile] = useState<DatabaseUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMacroPage, setCurrentMacroPage] = useState(0);
  const macroScrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  
  const { user } = useAuth();
  const { profile } = useUser();
  const streak = 0; // Static for now

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const profileData = await getUserProfile(user.id);
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);
  
  // Use real nutrition goals from user profile
  const targetCalories = userProfile?.daily_calorie_goal || 2000;
  const targetProtein = userProfile?.daily_protein_goal || 150;
  const targetCarbs = userProfile?.daily_carbs_goal || 250;
  const targetFats = userProfile?.daily_fat_goal || 65;
  
  // Calculate progress and remaining values
  const consumedCalories = totalCalories || 0; // Start at 0, use actual consumed when available
  const consumedProtein = totalProtein || 0; // Start at 0, use actual consumed when available
  const consumedCarbs = totalCarbs || 0; // Start at 0, use actual consumed when available
  const consumedFats = totalFat || 0; // Start at 0, use actual consumed when available
  
  const remaining = Math.max(0, targetCalories - consumedCalories);
  const calorieProgress = Math.min(100, (consumedCalories / targetCalories) * 100);
  
  // Debug logging
  console.log('Calorie Debug:', {
    consumed: consumedCalories,
    target: targetCalories,
    remaining: remaining,
    progress: calorieProgress,
    calculation: `${consumedCalories}/${targetCalories} = ${calorieProgress.toFixed(1)}%`
  });
  
  // Calculate remaining macros
  const proteinLeft = Math.max(0, targetProtein - consumedProtein);
  const carbsLeft = Math.max(0, targetCarbs - consumedCarbs);
  const fatLeft = Math.max(0, targetFats - consumedFats);

  // Macro sections data
  const macroSections = [
    {
      title: "Main Macros",
      items: [
        { value: `${proteinLeft}g`, label: "Protein left", icon: "🍴", bgColor: "#FFF5F5" },
        { value: `${carbsLeft}g`, label: "Carbs left", icon: "🌾", bgColor: "#F0FDF4" },
        { value: `${fatLeft}g`, label: "Fats left", icon: "💧", bgColor: "#F0F9FF" },
      ]
    },
    {
      title: "Progress Today",
      items: [
        { 
          value: `${Math.round((consumedProtein / targetProtein) * 100)}%`, 
          label: "Protein progress", 
          icon: "🥩", 
          bgColor: "#FEF2F2" 
        },
        { 
          value: `${Math.round((consumedCarbs / targetCarbs) * 100)}%`, 
          label: "Carbs progress", 
          icon: "🌾", 
          bgColor: "#F0FDF4" 
        },
        { 
          value: `${Math.round((consumedFats / targetFats) * 100)}%`, 
          label: "Fats progress", 
          icon: "🥑", 
          bgColor: "#ECFDF5" 
        },
      ]
    },
    {
      title: "Plant Power",
      items: [
        { value: "B12", label: "Supplement needed", icon: "💊", bgColor: "#F3E8FF" },
        { value: "Iron", label: "With vitamin C", icon: "🍋", bgColor: "#FEF3C7" },
        { value: "Ω3", label: "Plant sources", icon: "🥜", bgColor: "#ECFDF5" },
      ]
    }
  ];

  const handleMacroScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentMacroPage(pageNum);
  };

  const getMacroColor = (label: string) => {
    if (label.includes("Protein")) return "#FF6B6B";
    if (label.includes("Carbs")) return "#4ECDC4";
    if (label.includes("Fats")) return "#45B7D1";
    return "#333333";
  };

  const handleAddMeal = () => {
    router.push('/(tabs)/camera');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your nutrition goals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/Logo.jpg')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Fitly</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.weeklyCalendar}>
          {getWeekDays().map((day, index) => (
            <TouchableOpacity key={index} style={[
              styles.dayContainer,
              day.isToday && styles.todayContainer
            ]}>
              <Text style={[styles.dayLabel, day.isToday && styles.todayLabel]}>
                {day.label}
              </Text>
              <Text style={[styles.dayNumber, day.isToday && styles.todayNumber]}>
                {day.number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Calories Card with Progress Circle */}
        <View style={styles.mainCaloriesCard}>
          <View style={styles.mainCaloriesContent}>
            <View style={styles.caloriesTextSection}>
              <Text style={styles.mainCaloriesNumber}>{remaining}</Text>
              <Text style={styles.mainCaloriesLabel}>Calories left</Text>
            </View>
            <View style={styles.progressCircleContainer}>
              <AnimatedProgressCircle
                caloriesLeft={remaining}
                caloriesTarget={targetCalories}
                size={80}
                strokeWidth={6}
                progressColor="#333333"
                backgroundColor="#f0f0f0"
                textColor="#333333"
                animationDuration={1200}
                showPercentage={false}
              />
            </View>
          </View>
        </View>

        {/* Scrollable Macro Sections */}
        <View style={styles.macroSectionsContainer}>
          <ScrollView 
            ref={macroScrollViewRef}
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleMacroScroll}
            scrollEventThrottle={16}
            style={styles.macroScrollView}
          >
            {macroSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.macroSection}>
                <Text style={styles.macroSectionTitle}>{section.title}</Text>
                <View style={styles.macroCardsRow}>
                  {section.items.map((item, itemIndex) => {
                    // Calculate progress percentage for each macro
                    let progress = 0;
                    let current = 0;
                    let target = 0;
                    
                    if (section.title === "Main Macros") {
                      if (item.label.includes("Protein")) {
                        current = consumedProtein;
                        target = targetProtein;
                        progress = (current / target) * 100;
                      } else if (item.label.includes("Carbs")) {
                        current = consumedCarbs;
                        target = targetCarbs;
                        progress = (current / target) * 100;
                      } else if (item.label.includes("Fats")) {
                        current = consumedFats;
                        target = targetFats;
                        progress = (current / target) * 100;
                      }
                    } else if (section.title === "Progress Today") {
                      // Extract percentage from value (e.g., "25%" -> 25)
                      progress = parseInt(item.value.replace('%', '')) || 0;
                    }
                    
                    return (
                      <View key={itemIndex} style={styles.macroCard}>
                        <Text style={styles.macroCardNumber}>{item.value}</Text>
                        <Text style={styles.macroCardLabel} numberOfLines={2}>{item.label}</Text>
                        <View style={styles.macroProgressContainer}>
                          <AnimatedProgressCircle
                            caloriesLeft={section.title === "Main Macros" ? target - current : 100 - progress}
                            caloriesTarget={section.title === "Main Macros" ? target : 100}
                            size={60}
                            strokeWidth={3}
                            progressColor={getMacroColor(item.label)}
                            backgroundColor="#f0f0f0"
                            textColor="#333333"
                            animationDuration={1000}
                            showPercentage={false}
                            centerIcon=""
                          />
                          <View style={styles.macroIconOverlay}>
                            <Text style={styles.macroCardIcon}>{item.icon}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.macroPaginationContainer}>
            {macroSections.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.macroPaginationDot,
                  currentMacroPage === index && styles.macroPaginationDotActive
                ]}
              />
            ))}
          </View>
        </View>


        {/* Recently Uploaded */}
        <View style={styles.recentlyUploadedContainer}>
          <Text style={styles.sectionTitle}>Recently uploaded</Text>
          
          {meals.length > 0 ? (
            <View style={styles.recentMealsContainer}>
              {meals.slice(-3).reverse().map((meal) => {
                console.log('🍽️ Rendering meal:', meal.name, 'Image:', meal.image ? 'Available' : 'Missing');
                return (
                  <View key={meal.id} style={styles.recentMealCard}>
                    <View style={styles.mealImageContainer}>
                      {meal.image ? (
                        <Image 
                          source={{ uri: meal.image }} 
                          style={styles.mealImage}
                          resizeMode="cover"
                          onError={(error) => console.log('❌ Image load error:', error)}
                          onLoad={() => console.log('✅ Image loaded successfully for:', meal.name)}
                        />
                      ) : (
                        <Text style={styles.mealImageIcon}>🥗</Text>
                      )}
                    </View>
                    <View style={styles.recentMealInfo}>
                      <Text style={styles.recentMealName}>{meal.name}</Text>
                      <Text style={styles.recentMealCalories}>{meal.calories} calories</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <TouchableOpacity style={styles.emptyRecentContainer} onPress={handleAddMeal}>
              <View style={styles.mealImageContainer}>
                <Text style={styles.mealImageIcon}>🥗</Text>
              </View>
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyRecentText}>Tap + to add your first meal of the day</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to calculate streak
function calculateStreak(meals: any[]) {
  if (meals.length === 0) return 0;
  
  const today = new Date();
  const dates = meals.map(meal => meal.timestamp.toDateString());
  const uniqueDates = [...new Set(dates)].sort();
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const mealDate = new Date(uniqueDates[i]);
    if (mealDate.toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to get week days
function getWeekDays() {
  const today = new Date();
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get the start of the week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    days.push({
      label: dayNames[date.getDay()],
      number: date.getDate(),
      isToday: date.toDateString() === today.toDateString()
    });
  }
  
  return days;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weeklyCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  todayContainer: {
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  todayLabel: {
    color: '#333',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  todayNumber: {
    color: '#333',
  },
  caloriesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesText: {
    flex: 1,
  },
  caloriesNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  recentlyUploadedContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recentMealsContainer: {
    gap: 10,
  },
  recentMealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  mealImageIcon: {
    fontSize: 20,
  },
  recentMealInfo: {
    flex: 1,
  },
  recentMealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  recentMealCalories: {
    fontSize: 14,
    color: '#666',
  },
  emptyRecentContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyRecentText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  mainCaloriesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCaloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesTextSection: {
    flex: 1,
  },
  mainCaloriesNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  mainCaloriesLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  progressCircleContainer: {
    marginLeft: 20,
  },
  macroSectionsContainer: {
    marginBottom: 24,
    overflow: 'visible',
  },
  macroScrollView: {
    flex: 1,
    overflow: 'visible',
  },
  macroSection: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  macroSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  macroCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    overflow: 'visible',
  },
  macroCard: {
    flex: 1,
    maxWidth: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 180,
    height: 180,
    overflow: 'visible',
  },
  macroProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  macroIconOverlay: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  macroIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  macroPaginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 15,
  },
  macroPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  macroPaginationDotActive: {
    backgroundColor: '#333',
    width: 20,
  },
  macroCardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  macroCardLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
    flexShrink: 1,
  },
  macroCardIcon: {
    fontSize: 20,
  },
});
