import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MealData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  image?: string;
}

interface CalorieContextType {
  meals: MealData[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  addMeal: (meal: Omit<MealData, 'id' | 'timestamp'>) => void;
  dailyGoal: number;
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export function CalorieProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealData[]>([]);
  const dailyGoal = 2000;

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const addMeal = (mealData: Omit<MealData, 'id' | 'timestamp'>) => {
    const newMeal: MealData = {
      ...mealData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMeals(prev => [...prev, newMeal]);
  };

  return (
    <CalorieContext.Provider
      value={{
        meals,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        addMeal,
        dailyGoal,
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
}

export function useCalories() {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalories must be used within a CalorieProvider');
  }
  return context;
}
