import { supabase } from '@/integrations/supabase/client';
import { HydrationLog, Medication, MedicationLog, CrisisLog, Meal, Appointment } from '@/types/health';

export class HealthService {
  // Hydration Tracking
  static async getHydrationLogs(userId: string, date?: string) {
    let query = supabase
      .from('hydration_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as HydrationLog[];
  }

  static async logHydration(userId: string, glasses: number, date: string = new Date().toISOString().split('T')[0]) {
    // Check if log exists for today
    const existing = await this.getHydrationLogs(userId, date);
    
    if (existing.length > 0) {
      // Update existing log
      const { data, error } = await supabase
        .from('hydration_logs')
        .update({ 
          glasses_consumed: glasses,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('hydration_logs')
        .insert({
          user_id: userId,
          date,
          glasses_consumed: glasses,
          goal_glasses: 8 // Default goal
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  // Medication Management
  static async getMedications(userId: string) {
    console.log("running health service", data?.data)
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.data as Medication[];
  }

  static async addMedication(medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('medications')
      .insert(medication)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async logMedicationTaken(log: Omit<MedicationLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('medication_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getMedicationLogs(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('medication_logs')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });

    if (startDate) {
      query = query.gte('taken_at', startDate);
    }
    if (endDate) {
      query = query.lte('taken_at', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Crisis Tracking
  static async logCrisis(crisis: Omit<CrisisLog, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('crisis_logs')
      .insert(crisis)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCrisisLogs(userId: string, date?: string, limit: number = 10) {
    let query = supabase
      .from('crisis_logs')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('started_at', startOfDay.toISOString())
        .lte('started_at', endOfDay.toISOString());
    } else {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as CrisisLog[];
  }

  static async updateCrisisEnd(crisisId: string, endedAt: string, treatments: string[], notes?: string) {
    const { data, error } = await supabase
      .from('crisis_logs')
      .update({
        ended_at: endedAt,
        treatments_used: treatments,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', crisisId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Appointments
  static async getAppointments(userId: string, date?: string, upcoming: boolean = true) {
    const now = new Date().toISOString();

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString());
    } else if (upcoming) {
      query = query.gte('appointment_date', now);
    }

    query = query.order('appointment_date', { ascending: upcoming });

    const { data, error } = await query;
    if (error) throw error;
    return data as Appointment[];
  }

  static async addAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Meal Logging
  static async logMeal(meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getMeals(userId: string, date?: string) {
    let query = supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('meal_time', { ascending: false });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query = query
        .gte('meal_time', startOfDay.toISOString())
        .lte('meal_time', endOfDay.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Meal[];
  }
}
