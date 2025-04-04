import { Stack } from 'expo-router';
import {StyleSheet} from 'react-native';
export default function Layout() {
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: 'white', // Set the background color to white
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
    <Stack>
      <Stack.Screen
        name="ExerciseDetail"
        options={{ title: 'Exercise Details' }}
      />
      <Stack.Screen
        name="WorkoutPlanScreen"
        options={{ title: 'Workout Plan' }}
      />
      <Stack.Screen 
      name="StartWorkoutScreen"
      options={{ title: 'Start Workout' }}
      />
      <Stack.Screen
      name="CompletedWorkoutsScreen"
      options={{ title: 'Completed Workouts' }}
      />
    </Stack>
  );
}
