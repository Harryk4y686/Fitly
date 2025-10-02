import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const handleContinue = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with back button and progress bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerProgressBar}>
          <View style={styles.headerProgressFill} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={32} color="#ffffff" />
          </View>
          <Text style={styles.congratsTitle}>Congratulations</Text>
          <Text style={styles.congratsSubtitle}>your custom plan is ready!</Text>
          
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>You should gain:</Text>
            <Text style={styles.goalValue}>10 lbs by September 28</Text>
          </View>
        </View>

        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Daily recommendation</Text>
          <Text style={styles.sectionSubtitle}>You can edit this anytime</Text>
          
          <View style={styles.progressGrid}>
            {/* Calories */}
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.progressCircle, styles.caloriesCircle]}>
                  <Text style={styles.progressValue}>2465</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={styles.progressLabel}>Calories</Text>
              </View>
            </View>
            
            {/* Carbs */}
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.progressCircle, styles.carbsCircle]}>
                  <Text style={styles.progressValue}>295</Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="leaf" size={16} color="#FFA726" />
                <Text style={styles.progressLabel}>Carbs</Text>
              </View>
            </View>
            
            {/* Protein */}
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.progressCircle, styles.proteinCircle]}>
                  <Text style={styles.progressValue}>166</Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="fitness" size={16} color="#EF5350" />
                <Text style={styles.progressLabel}>Protein</Text>
              </View>
            </View>
            
            {/* Fats */}
            <View style={styles.progressContainer}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.progressCircle, styles.fatsCircle]}>
                  <Text style={styles.progressValue}>68</Text>
                  <Text style={styles.progressUnit}>g</Text>
                </View>
                <Ionicons name="create-outline" size={16} color="#666" style={styles.editIcon} />
              </View>
              <View style={styles.progressLabelContainer}>
                <Ionicons name="water" size={16} color="#42A5F5" />
                <Text style={styles.progressLabel}>Fats</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.goalsSectionTitle}>How to reach your goals:</Text>
          
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>💖</Text>
              <Text style={styles.goalItemTitle}>Get your weekly life score and improve your routine.</Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🥗</Text>
              <Text style={styles.goalItemTitle}>Track your food</Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>🎯</Text>
              <Text style={styles.goalItemTitle}>Follow your daily calorie recommendation</Text>
            </View>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalIcon}>⚖️</Text>
              <Text style={styles.goalItemTitle}>Balance your carbs, protein, fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Let's get started!</Text>
          </TouchableOpacity>
          
          {/* Bottom home indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  headerProgressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 32,
  },
  goalContainer: {
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 0,
    padding: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 32,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressContainer: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 32,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    backgroundColor: '#ffffff',
  },
  caloriesCircle: {
    borderColor: '#FF6B6B',
    borderTopColor: '#FF6B6B',
    borderRightColor: '#FF6B6B',
    borderBottomColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
  },
  carbsCircle: {
    borderColor: '#FFA726',
    borderTopColor: '#FFA726',
    borderRightColor: '#FFA726',
    borderBottomColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
  },
  proteinCircle: {
    borderColor: '#EF5350',
    borderTopColor: '#EF5350',
    borderRightColor: '#EF5350',
    borderBottomColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
  },
  fatsCircle: {
    borderColor: '#42A5F5',
    borderTopColor: '#42A5F5',
    borderRightColor: '#f0f0f0',
    borderBottomColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressUnit: {
    fontSize: 12,
    color: '#666666',
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  goalsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  goalsList: {
    gap: 15,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  goalItemTitle: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
});
