import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutContextType {
    userweight: number;
    setuserweight:React.Dispatch<React.SetStateAction<number>>;
    exercises: any[];
    setExercises: React.Dispatch<React.SetStateAction<never[]>>;
    loading: boolean;
    workoutPlans: any;
    completedWorkouts: any[];
    activeWorkout: any;
    modalVisible: boolean;
    showExistingPlansModal: boolean;
    newPlanName: string;
    timer: number;
    isActive: boolean;
    workouts: any[];
    setWorkout: React.Dispatch<React.SetStateAction<never[]>>;
    fetchWorkoutPlans: () => Promise<void>;
    fetchCompletedWorkouts: () => Promise<void>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setWorkoutPlans: React.Dispatch<React.SetStateAction<any>>;
    setActiveWorkout: React.Dispatch<React.SetStateAction<any>>;
    setCompletedWorkouts: React.Dispatch<React.SetStateAction<never[]>>;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setShowExistingPlansModal: React.Dispatch<React.SetStateAction<boolean>>;
    setNewPlanName: React.Dispatch<React.SetStateAction<string>>;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    
    }
  
  const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workoutPlans, setWorkoutPlans] = useState({});
    const [completedWorkouts, setCompletedWorkouts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showExistingPlansModal, setShowExistingPlansModal] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workouts, setWorkout] = useState([]);
    const [userweight, setuserweight] = useState(70); 
    const fetchWorkoutPlans = async () => {
        try {
          const saved = await AsyncStorage.getItem('savedWorkouts');
          setWorkoutPlans(saved ? JSON.parse(saved) : {});
          setLoading(false);
        } catch (error) {
          console.error('Error fetching plans:', error);
          setLoading(false);
        }
      };
    

    const fetchCompletedWorkouts = async () => {
        try {
          const completed = await AsyncStorage.getItem('completedWorkouts');
          setCompletedWorkouts(completed ? JSON.parse(completed) : []);
        } catch (error) {
          console.error('Error fetching completed workouts:', error);
        }
      };

  return (
    <WorkoutContext.Provider value={{
      exercises, setExercises, loading, setLoading,
      workoutPlans, setWorkoutPlans, completedWorkouts, setCompletedWorkouts,
      modalVisible, setModalVisible, showExistingPlansModal, setShowExistingPlansModal,
      newPlanName, setNewPlanName, timer, setTimer, isActive, setIsActive,
      activeWorkout, setActiveWorkout, fetchWorkoutPlans, fetchCompletedWorkouts,workouts,setWorkout,
      userweight, setuserweight,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('Context not wrapped!');
  return context;
};
