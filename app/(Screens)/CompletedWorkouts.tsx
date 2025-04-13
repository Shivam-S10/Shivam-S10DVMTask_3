import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkoutContext} from "../WorkoutContext";


export default function CompletedWorkoutsScreen() {
  const {completedWorkouts, setCompletedWorkouts} = useWorkoutContext();
  

  // Fetch completed workouts when the component mounts
  useEffect(() => {
    fetchCompletedWorkouts()
  }, []);


  // Fetch completed workouts from AsyncStorage
  const fetchCompletedWorkouts = async () => {
    try {
      const completed = await AsyncStorage.getItem('completedWorkouts');
      const parsedCompleted = completed ? JSON.parse(completed) : [];
      const sortedCompleted = parsedCompleted.sort((a: { date: string }, b: { date: string }) => 
        new Date(b.date).getTime() - new Date(a.date).getTime());
      setCompletedWorkouts(sortedCompleted);
    } catch (error) {
      console.error('Error fetching completed workouts:', error);
    }
  };
  

  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const removeCompletedWorkout = async (workoutDate: string) => {
    try {
      const updatedWorkouts = completedWorkouts.filter(
        (workout) => workout.date !== workoutDate
      );
      setCompletedWorkouts(updatedWorkouts);
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Error removing completed workout:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* List of Completed Workouts */}
      <FlatList
  data={completedWorkouts}
  keyExtractor={(item) => `${item.date}_${item.workoutName}_${item.planName}`}


  renderItem={({ item }: { item: { workoutName?: string; planName?: string; duration?: number; date: string; caloriesBurned?: number; exercises?: string[] } }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutName}>{item.workoutName || 'Unknown Workout'}</Text>
      <Text style={styles.detail}>Plan: {item.planName || 'Unnamed Plan'}</Text>
      <Text style={styles.detail}>Duration: {formatDuration(item.duration || 0)}</Text>
      <Text style={styles.detail}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Calories Burned: {item.caloriesBurned || 0} kcal</Text>
      <Text style={styles.detail}>Exercises:</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeCompletedWorkout(item.date)}>
        <Text style={styles.removeButtonText}>Remove Workout</Text>
      </TouchableOpacity>
      {item.exercises && item.exercises.length > 0 ? (
        item.exercises.map((exercise: string, idx: number) => (
          <Text key={idx} style={styles.exerciseName}>
            - {exercise}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyExercise}>No exercises recorded</Text>
      )}
    </View>
  )}
  ListEmptyComponent={
    <Text style={styles.emptyText}>No completed workouts found</Text>
  }
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#EBE8DB' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  workoutItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutName: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  detail: { color: '#ccc', fontSize: 14, marginTop: 5 },
  exerciseName: { color: '#fff', fontSize: 16, marginTop: 5 },
  emptyExercise: { color: '#888', fontSize: 14 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 20 },
  removeButton:{color: 'red', fontSize: 16, marginTop: 10, textAlign: 'right'},
  removeButtonText: { color: 'red', fontSize: 16, marginTop: 10, textAlign: 'right' },
});
