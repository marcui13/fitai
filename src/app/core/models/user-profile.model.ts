export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
  availableDays: number;
  equipment: 'none' | 'home' | 'gym';
  bmi: number;
} 