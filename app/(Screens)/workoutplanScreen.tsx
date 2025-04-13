// Update app/(screens)/workoutplanScreen.tsx
import React, { useEffect,useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutContext } from '../WorkoutContext';
import {FontAwesome} from '@expo/vector-icons';
export default function WorkoutPlanScreen() {
  const {workouts, setWorkout}= useWorkoutContext();
  const {timer, setTimer} = useWorkoutContext();
  const {isActive, setIsActive} = useWorkoutContext();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [showWorkoutView, setShowWorkoutView] = useState(false);
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

  const handleWorkoutPress = (workout: any) => {
    setActiveWorkout(workout);
    setShowWorkoutView(true);
    setIsActive(false);
    setTimer(0);
  };

  const handleStartWorkout = () => {
    setIsActive(true);
    Alert.alert('Workout Started', `You are now doing ${activeWorkout?.name}`);
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
      router.push({
        pathname: '/(Screens)/workoutplanScreen',
        params: { planName: params.planName }
      });
      setTimer(0);
      setActiveWorkout(null);
      setShowWorkoutView(false);
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout.');
    }
  };
  
  
  
  

  return (
    <View style={styles.container}>
      {showWorkoutView ? (
        // Workout Timer View
        <View style={styles.timerContainer}>
          <Text style={[styles.header, { color: 'red' }]}>{activeWorkout?.name}</Text>
          <Text style={[styles.timer, { color: 'red' }]}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </Text>
          {!isActive ? (
           
            <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
              <Text style={styles.buttonText}>Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.endButton}
              onPress={() => handleEndWorkout(activeWorkout)}
            >
              <Text style={styles.endButtonText}>End Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // Workout List View
        <FlatList
          data={workouts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleWorkoutPress(item)}
              style={styles.workoutItem}
            >
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{item.name}</Text>
                <Text style={styles.workoutDetails}>Equipment: {item.equipment}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  setActiveWorkout(item);
                  setIsActive(true);
                  setTimer(0);
                }}
              >
                <FontAwesome name="play" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No workouts in this plan</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#EBE8DB' },
  workoutInfo:{
    flex:1,
    backgroundColor: '#F0A04B',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  workoutItem: {
    padding: 15,
    backgroundColor: '#F0A04B',
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutName: { fontSize: 18, fontWeight: 'bold' },
  workoutDetails: { color: 'black' },
  timerContainer: { alignItems: 'center', marginTop: 40 },
  timer: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  startButton:{
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center'

  },
  buttonText:{
    color:'white',
    fontWeight:'bold'
  },
  endButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  endButtonText: { color: 'white', fontWeight: 'bold' }
});
