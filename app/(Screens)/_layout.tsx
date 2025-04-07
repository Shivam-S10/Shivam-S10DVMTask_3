import { Stack } from 'expo-router';
import {StyleSheet} from 'react-native';
import { WorkoutProvider } from '../WorkoutContext'; 
export default function Layout() {
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: 'white',
        },
        header: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        ButtonContainer: {
          marginTop: 20,
        },
      });
      
  return (
  
    <Stack >
      <Stack.Screen
        name="ExcerciseDetail"
        options={{ title: 'Exercise Details' }}
      />
      <Stack.Screen
        name="workoutplanScreen"
        options={{ title: 'Workout Plan' }}
      />
      <Stack.Screen 
      name="StartWorkoutScreen"
      options={{ title: 'Start Workout' }}
      />
      <Stack.Screen
      name="CompletedWorkouts"
      options={{ title: 'Completed Workouts' }}
      />
    </Stack>
    
  
  );
}
