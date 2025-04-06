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
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  startButtonText: { color: '#fff', fontSize: 18 },
  exerciseItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
