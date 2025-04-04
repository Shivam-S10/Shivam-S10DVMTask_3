// Create a new file: app/(screens)/StartWorkoutScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';

export default function StartWorkoutScreen() {
  const [workoutPlans, setWorkoutPlans] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);
  const handlePlanPress = (planName) => {
    // Navigate to WorkoutPlanScreen with the selected plan name
    router.push({
      pathname: '/(Screens)/workoutplanScreen', 
      params: { planName },
    });
  };

  const fetchWorkoutPlans = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem('savedWorkouts');
      setWorkoutPlans(savedPlans ? JSON.parse(savedPlans) : {});
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  return (
    <View style={styles.container}>
      

      <Text style={styles.header}>Select Workout Plan</Text>
      <FlatList
        data={Object.keys(workoutPlans)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={styles.planItem}
          onPress={() => handlePlanPress(item)}
          >
            <Text style={styles.planName}>{item}</Text>
            <Text style={styles.workoutCount}>
              {workoutPlans[item]?.length || 0} workouts
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workout plans available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  planItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  planName: { fontSize: 18, fontWeight: 'bold' },
  workoutCount: { color: '#888', marginTop: 5 },
  emptyText: { textAlign: 'center', color: '#888' }
});
