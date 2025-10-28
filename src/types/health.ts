
export interface HydrationLog {
  id: string;
  user_id: string;
  date: string;
  glasses_consumed: number;
  goal_glasses: number;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  medication_id: string;
  taken_at: string;
  dosage_taken: string;
  notes?: string;
  was_on_time: boolean;
  created_at: string;
}

export interface CrisisLog {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  pain_level: number; // 1-10 scale
  triggers?: string[];
  symptoms: string[];
  treatments_used: string[];
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  meal_time: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  hydration_ml?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  healthcare_provider: string;
  appointment_date: string;
  location?: string;
  notes?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeatherLog {
  id: string;
  user_id: string;
  date: string;
  temperature: number;
  humidity: number;
  pressure?: number;
  weather_condition: string;
  symptom_severity?: number; // 1-10 scale
  notes?: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood_level: number; // 1-10 scale
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatLog {
  id: string;
  user_id: string;
  message: string;
  response: string;
  message_type: 'question' | 'emergency' | 'general';
  created_at: string;
}
