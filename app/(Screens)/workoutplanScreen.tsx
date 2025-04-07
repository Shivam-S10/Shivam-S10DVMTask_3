// Update app/(screens)/workoutplanScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutContext } from '../WorkoutContext';
export default function WorkoutPlanScreen() {
  const {workouts, setWorkout}= useWorkoutContext();
  const {timer, setTimer} = useWorkoutContext();
  const {isActive, setIsActive} = useWorkoutContext();
  const params = useLocalSearchParams();
  const router = useRouter();
  const {activeWorkout, setActiveWorkout} = useWorkoutContext(); 

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (params.planName) {
      fetchWorkouts(params.planName as string);
    }
  }, [params]);

  const fetchWorkouts = async (planName: string) => {
    try {
      const savedPlans = await AsyncStorage.getItem('savedWorkouts');
      const parsedPlans = savedPlans ? JSON.parse(savedPlans) : {};
      setWorkout(parsedPlans[planName] || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleStartWorkout = (workout: any) => {
    setIsActive(true);
    setTimer(0);
    setActiveWorkout(workout); //Set the active workout to the selected workout
    Alert.alert('Workout Started', `You are now doing ${workout.name}`);
  };
  const handleEndWorkout = async (completedExercise: { name: string }) => {
    setIsActive(false); // Stop the timer
    try {
      const durationMinutes = Math.round(timer / 60);
      const userWeight = 70; // Replace this with dynamic user weight if available
  
      // Fetch calories burned using API
      const apiResponse = await fetch(
        `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(completedExercise.name)}&weight=${userWeight}&duration=${durationMinutes}`,
        { headers: { 'X-Api-Key': 'up59jodbZtEvBFalwBXJlQ==rcyaDWAEAlUvKVgq' } }
      );
      const data = await apiResponse.json();
      const caloriesBurned = data[0]?.total_caloriesburned || Math.round(200 * timer / 3600);
  
      // Create completed workout object
      const completedWorkout = {
        workoutName: completedExercise.name,
        planName: params.planName,
        duration: timer, // Duration in seconds
        date: new Date().toISOString(),
        caloriesBurned,
        exercises: [completedExercise.name],
      };
  
      // Save to AsyncStorage
      const existing = await AsyncStorage.getItem('completedWorkouts');
      const completed = existing ? JSON.parse(existing) : [];
      completed.push(completedWorkout);
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(completed));
  
      Alert.alert('Success', 'Workout saved successfully!');
      router.push('/(Screens)/CompletedWorkouts'); // Navigate to Completed Workouts page
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout.');
    }
  };
  
  
  
  

  return (
      <View style={styles.container}>
       
        <Text style={styles.header}>
          {isActive ? activeWorkout?.name : params.planName}
        </Text>
     
        {isActive ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</Text>
            <TouchableOpacity style={styles.endButton} onPress={() => handleEndWorkout(activeWorkout)}>
              <Text style={styles.endButtonText}>End Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
          data={workouts}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => handleStartWorkout(item)}>
                <View style={styles.workoutItem}>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <Text style={styles.workoutDetails}>{item.equipment}</Text>
                </View>
              </TouchableOpacity>
              
              {isActive && (
                <TouchableOpacity
                  style={styles.endButton}
                  onPress={() => handleEndWorkout(item)} // Pass the selected exercise
                >
                  <Text style={styles.endButtonText}>End Workout</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        
        
      )
      }
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  workoutItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutName: { fontSize: 18, fontWeight: 'bold' },
  workoutDetails: { color: '#888' },
  timerContainer: { alignItems: 'center', marginTop: 40 },
  timer: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  endButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  endButtonText: { color: 'white', fontWeight: 'bold' }
});
