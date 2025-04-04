 export interface Exercise {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
  }
  
  export interface Workout {
    name: string;
    exercises: Exercise[];
  }
  export default Exercise;
