import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
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
        AsyncStorage.setItem('exercises', JSON.stringify(data));
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
      <Link href="/(Screens)/StartWorkoutScreen" style={styles.startButton}>
        <Text style={styles.startButtonText}>Start New Workout</Text>
      </Link>

      {/* Exercises List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(Screens)/ExcerciseDetail',
                  params: { exercise: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.exerciseItem}>{item.name}</Text>
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
