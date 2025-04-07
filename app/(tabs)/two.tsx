import React, { useEffect , useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useWorkoutContext } from '../WorkoutContext';
import { useFocusEffect } from '@react-navigation/native';
export default function ProfileScreen() {
  const {workoutPlans, setWorkoutPlans} = useWorkoutContext();
  const {newPlanName, setNewPlanName} = useWorkoutContext();
  const {modalVisible, setModalVisible} = useWorkoutContext();
  const router = useRouter();
  useFocusEffect(
    React.useCallback(() => {
      fetchSavedWorkouts();
      return () => {
        setNewPlanName('');
      }

    }, [])
  );
  const handleRemovePlan = async (planName: string) => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to delete "${planName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            // Create copy of plans without the deleted one
            

            
            try {
            const remainingPlans = { ...workoutPlans };
            delete remainingPlans[planName];
              await AsyncStorage.setItem(
                'savedWorkouts', 
                JSON.stringify(remainingPlans)
              );
              setWorkoutPlans(remainingPlans);
             Alert.alert('Success', 'Plan removed successfully');

            
              
            } catch (error) {
              console.error('Error removing plan:', error);
              Alert.alert('Error', 'Failed to remove plan');
            }
          }
        }
      ]
    );
  };
  
  const fetchSavedWorkouts = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem('savedWorkouts');
      const parsedPlans = savedPlans ? JSON.parse(savedPlans) : {};
      setWorkoutPlans(parsedPlans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };
  useEffect(() => {
    fetchSavedWorkouts();
  }, []);
  const handleOutsideTap = () => {
    setNewPlanName('');
    Keyboard.dismiss();
  }

  const handlePlanPress = (planName: string) => {


    router.push({
      pathname: '/(Screens)/workoutplanScreen',
      params: { planName },
    });
  };

  const addNewPlan = async () => {
    if (!newPlanName.trim()) {
      Alert.alert('Error', 'Please enter a valid plan name.');
return;
    }

    if (workoutPlans[newPlanName]) {
      Alert.alert('Error', 'A workout plan with this name already exists.');
      return;
    }

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
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
       <View style={styles.container}>
       <Text style={styles.header}>Your Workout Plans</Text>
     <View style={styles.addPlanContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter plan name"
          placeholderTextColor="#aaa"
          value={newPlanName}
          onChangeText={(text) => setNewPlanName(text)}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addNewPlan}
        >
          <Text style={styles.addButtonText}>Add Plan</Text>
        </TouchableOpacity>
      </View>


      {/* List of Plans */}
      <FlatList
  data={Object.keys(workoutPlans)}
  keyExtractor={(item) => item}
  renderItem={({ item }) => (
    <View style={styles.planItem}>
      <TouchableOpacity onPress={() => handlePlanPress(item)} style={{ flex: 1 }}>
        <Text style={styles.planName}>{item}</Text>
        <Text style={styles.planCount}>
          {workoutPlans[item]?.length || 0} workouts
        </Text>
      </TouchableOpacity>
      
      {/* Remove Button */}
      <TouchableOpacity 
        onPress={() => handleRemovePlan(item)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )}
/>
      

{Object.keys(workoutPlans).length > 0 ? (
        <Text style={styles.para}>
          Please click on the name of any one of these workout plans to open and view the workouts in it.
        </Text>
      ): (<Text style={styles.para}>
        No workout plans made yet.
        </Text>)}

      {/* Completed Workouts Button */}
      <TouchableOpacity
        style={styles.completedButton}
        onPress={() => router.push('/(Screens)/CompletedWorkouts')}
      >
        <Text style={styles.completedButtonText}>View Completed Workouts</Text>
      </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  para:{color: 'white', fontSize: 16, marginBottom: 20},
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
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    marginLeft: 10
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14
  },
  
});
