import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { useRouter } from 'expo-router';
import { useWorkoutContext } from '../WorkoutContext';
export default function StartWorkoutScreen() {
  const {workoutPlans, fetchWorkoutPlans,loading,setWorkoutPlans} = useWorkoutContext();
  const router = useRouter();

  const selectPlans =  
Object.keys(workoutPlans).filter((planName)=> 
  workoutPlans[planName].length > 0);
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const handlePlanPress = (planName: string) => {
    
    router.push({
      pathname: '/(Screens)/workoutplanScreen', 
      params: { planName },
    });
  };
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Workout Plan</Text>
      
      <FlatList
        data={selectPlans}
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
          <Text style={styles.emptyText}>No non-empty workout plans found</Text>
        }
      />
    </View>
  );
};



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
