import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkoutContext } from '../WorkoutContext';

export default function DashboardScreen() {
  // Destructure the context properly
  const { exercises, setExercises, loading, setLoading } = useWorkoutContext();

  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('exercises');
      if (cachedData) {
        setExercises(JSON.parse(cachedData));
      } else {
        const response = await fetch(
          'https://api.api-ninjas.com/v1/exercises?muscle=biceps',
          { headers: { 'X-Api-Key': 'up59jodbZtEvBFalwBXJlQ==rcyaDWAEAlUvKVgq' } }
        );
        const data = await response.json();
        setExercises(data);
        await AsyncStorage.setItem('exercises', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* Start New Workout Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/(Screens)/StartWorkoutScreen')}
      >
        <Text style={styles.startButtonText}>Start New Workout</Text>
      </TouchableOpacity>

      {/* List of Exercises */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseItem}
              onPress={() =>
                router.push({
                  pathname: '/(Screens)/ExcerciseDetail',
                  params: { exercise: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.exerciseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No exercises found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  startButton: {
    backgroundColor: 'rgba(195, 18, 18, 0.8)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  startButtonText: { color: 'rgba(120, 187, 141, 0.9)', fontSize: 18 },
  exerciseItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'White',

  },
  exerciseName: {
    fontSize: 16,
    color: 'white', // White text for workout names
    fontWeight: 'bold',
  },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },

});
