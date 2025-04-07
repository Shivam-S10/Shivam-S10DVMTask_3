import React ,{useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkoutContext } from '../WorkoutContext';
export default function ExerciseDetail() {
  const params = useLocalSearchParams();
  const {
    modalVisible,
    setModalVisible,
    showExistingPlansModal,
    setShowExistingPlansModal,
    newPlanName,
    setNewPlanName,
    workoutPlans,
    setWorkoutPlans,
    fetchWorkoutPlans,
  } = useWorkoutContext();
  const [exerciseData, setExerciseData] = React.useState<{ name: string; type: string; muscle: string; equipment: string; instructions: string } | null>(null);
  useEffect(() => {
    if (params?.exercise) {
      try {
        const parsedData = JSON.parse(params.exercise as string);
        setExerciseData(parsedData);
      } catch (error) {
        console.error('Error parsing exercise data:', error);
        Alert.alert('Error', 'Failed to load exercise details.');
      }
    }
  }, [params.exercise]);

  if (!exerciseData) {
    return <Text>Error loading exercise data</Text>;
  }

  const handleAddWorkout = async () => {
    await fetchWorkoutPlans();
    Alert.alert(
      'Add Workout',
      `How would you like to add "${exerciseData.name}"?`,
      [
        { text: 'Create New Plan', onPress: () => setModalVisible(true) },
        { text: 'Add to Existing Plan', onPress: () => setShowExistingPlansModal(true) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addToExistingPlan = async (planName: string) => {
    if (workoutPlans[planName]?.some((w: any) => w.name === exerciseData.name)) {
      Alert.alert('Duplicate', 'This workout already exists in the selected plan!');
      return;
    }

    const updatedPlans = {
      ...workoutPlans,
      [planName]: [...(workoutPlans[planName] || []), exerciseData],
    };
    await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedPlans));
    Alert.alert('Success', `Added to ${planName} successfully!`);
    setShowExistingPlansModal(false);
  };

  const createNewPlan = async () => {
    if (!newPlanName.trim()) {
      Alert.alert('Error', 'Please enter a valid plan name.');
      return;
    }
    if (workoutPlans[newPlanName]) {
      Alert.alert('Error', 'A workout plan with this name already exists.');
      return;
    }

    const updatedPlans = {
      ...workoutPlans,
      [newPlanName]: [exerciseData],
    };
    try {
    await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedPlans));
    setWorkoutPlans(updatedPlans);
    setNewPlanName('');
    setModalVisible(false);
    Alert.alert('Success', `Created "${newPlanName}" and added the workout!`);
  } catch (error){
    console.error("Error creating new workout plan :", error);
  }
  };
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'black' },
    addButton: { color: 'white', backgroundColor: 'blue', padding: 15, borderRadius: 8, marginTop: 20 },
    addButtonText: { color: 'white', fontSize: 18, textAlign: 'center' },
   para : { color: 'white', fontSize: 16, marginBottom: 10 },
  
    scrollContainer: { paddingBottom: 20 }, // Ensures scrollable content
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 , color: 'white'},
    instructions: { marginTop: 10, fontSize: 16, lineHeight: 24 },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay for better contrast
    },
    modalContent: {
      width: '85%',
      backgroundColor: '#2C2C2C', // Dark gray for better readability
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF', // White text for clear visibility
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#888', // Light gray border for subtle contrast
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#3A3A3A', // Darker background for input field
      color: '#FFFFFF', // White text for readability
      marginBottom: 15,
    },
    createButton: {
      backgroundColor: '#4CAF50', // Green for positive action
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    createButtonText: { color: 'white' },
    cancelButton: {
      backgroundColor: '#FF3B30', // Red for cancel action
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10, // Space between buttons
    },
      cancelButtonText: { color: 'white' },
    instructionsContainer: {
      backgroundColor: '#f0f0f0',},
      planButtonText: {
        color: 'white',
        fontSize: 16,
      },
      planButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 10,
      },

  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  buttonText: {
    color: '#FFFFFF', // White text for readability
    fontSize: 16, // Larger font size for prominence
    fontWeight: 'bold',
  },

  plansList: {
    maxHeight: 250, // Increased height for better scrolling
    marginBottom: 15,
  },
  planItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#444', // Medium gray for better visibility
    borderRadius: 8,
    marginBottom: 10,
  },
  planText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for readability
  },
});
return (
    <View style={styles.container}>
      <Text style={styles.header}>{exerciseData.name}</Text>
      <Text style={styles.para}>Type: {exerciseData.type}</Text>
      <Text style={styles.para}>Muscle Group: {exerciseData.muscle}</Text>
      <Text style={styles.para}>Equipment: {exerciseData.equipment}</Text>
    <ScrollView style={styles.instructionsContainer}>
      <Text style={styles.instructions}>Instructions: {exerciseData.instructions}</Text>
    </ScrollView>
    <TouchableOpacity onPress={handleAddWorkout} style={styles.addButton}>
      <Text style={styles.addButtonText}>ADD TO WORKOUT PLAN</Text>
    </TouchableOpacity>

    {/* Create New Plan Modal */}
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Plan</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter plan name"
            placeholderTextColor="#888"
            value={newPlanName}
            onChangeText={setNewPlanName}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={createNewPlan}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Existing Plans Modal */}
    <Modal visible={showExistingPlansModal} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Existing Plan</Text>
          <ScrollView style={styles.plansList}>
            {Object.keys(workoutPlans).map((planName) => (
              <TouchableOpacity
                key={planName}
                style={styles.planItem}
                onPress={() => addToExistingPlan(planName)}
              >
                <Text style={styles.planText}>{planName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowExistingPlansModal(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
}


