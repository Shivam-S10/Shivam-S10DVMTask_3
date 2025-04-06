import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useWorkoutContext } from '../WorkoutContext';

export default function ProfileScreen() {
  const {workoutPlans, setWorkoutPlans} = useWorkoutContext();
  const {newPlanName, setNewPlanName} = useWorkoutContext();
  const router = useRouter();

  useEffect(() => {
    fetchSavedWorkouts();
  }, []);

  const fetchSavedWorkouts = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem('savedWorkouts');
      const parsedPlans = savedPlans ? JSON.parse(savedPlans) : {};
      setWorkoutPlans(parsedPlans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const handlePlanPress = (planName) => {
    router.push({
      pathname: '/(Screens)/workoutplanScreen',
      params: { planName },
    });
  };

  const addNewPlan = async () => {
    if (!newPlanName.trim()) return;

    if (workoutPlans[newPlanName]) return;

    const updatedPlans = { ...workoutPlans, [newPlanName]: [] };
    try {
      await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedPlans));
      setWorkoutPlans(updatedPlans);
      setNewPlanName('');
    } catch (error) {
      console.error('Error creating new workout plan:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Workout Plans</Text>

      {/* Add New Plan Section */}
      <View style={styles.addPlanContainer}>
        <TextInput
          placeholder="Enter new plan name"
          value={newPlanName}
          onChangeText={setNewPlanName}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={addNewPlan} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Plan</Text>
        </TouchableOpacity>
      </View>

      {/* List of Plans */}
      <FlatList
        data={Object.keys(workoutPlans)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.planItem}
            onPress={() => handlePlanPress(item)}
          >
            <Text style={styles.planName}>{item}</Text>
            <Text style={styles.planCount}>
              {workoutPlans[item]?.length || 0} workouts
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Completed Workouts Button */}
      <TouchableOpacity
        style={styles.completedButton}
        onPress={() => router.push('/(Screens)/CompletedWorkouts')}
      >
        <Text style={styles.completedButtonText}>View Completed Workouts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  addPlanContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#333',
    marginRight: 10,
    height: 40,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: 'white' },
  planItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: { color: 'white', fontSize: 18 },
  planCount: { color: '#aaa', fontSize: 14 },
  
completedButton:{alignItems:'center',backgroundColor:'#007AFF',padding:10,borderRadius:8,marginTop:20},
  completedButtonText:{color:'white',fontSize:16},
});
