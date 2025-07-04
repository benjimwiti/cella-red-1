export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          healthcare_provider: string
          id: string
          is_completed: boolean
          location: string | null
          notes: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          healthcare_provider: string
          id?: string
          is_completed?: boolean
          location?: string | null
          notes?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          healthcare_provider?: string
          id?: string
          is_completed?: boolean
          location?: string | null
          notes?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          message_type: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          message_type: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      crisis_logs: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          location: string | null
          notes: string | null
          pain_level: number
          started_at: string
          symptoms: string[]
          treatments_used: string[]
          triggers: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          pain_level: number
          started_at: string
          symptoms?: string[]
          treatments_used?: string[]
          triggers?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          pain_level?: number
          started_at?: string
          symptoms?: string[]
          treatments_used?: string[]
          triggers?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hydration_logs: {
        Row: {
          created_at: string | null
          date: string
          glasses_consumed: number
          goal_glasses: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          glasses_consumed?: number
          goal_glasses?: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          glasses_consumed?: number
          goal_glasses?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          created_at: string | null
          foods: string[]
          hydration_ml: number | null
          id: string
          meal_time: string
          meal_type: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          foods?: string[]
          hydration_ml?: number | null
          id?: string
          meal_time: string
          meal_type: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          foods?: string[]
          hydration_ml?: number | null
          id?: string
          meal_time?: string
          meal_type?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string | null
          dosage_taken: string
          id: string
          medication_id: string
          notes: string | null
          taken_at: string
          user_id: string
          was_on_time: boolean
        }
        Insert: {
          created_at?: string | null
          dosage_taken: string
          id?: string
          medication_id: string
          notes?: string | null
          taken_at: string
          user_id: string
          was_on_time?: boolean
        }
        Update: {
          created_at?: string | null
          dosage_taken?: string
          id?: string
          medication_id?: string
          notes?: string | null
          taken_at?: string
          user_id?: string
          was_on_time?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          start_date: string
          time_of_day: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          start_date: string
          time_of_day?: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          start_date?: string
          time_of_day?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          name: string | null
          region: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id: string
          name?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_logs: {
        Row: {
          created_at: string | null
          date: string
          humidity: number
          id: string
          notes: string | null
          pressure: number | null
          symptom_severity: number | null
          temperature: number
          user_id: string
          weather_condition: string
        }
        Insert: {
          created_at?: string | null
          date: string
          humidity: number
          id?: string
          notes?: string | null
          pressure?: number | null
          symptom_severity?: number | null
          temperature: number
          user_id: string
          weather_condition: string
        }
        Update: {
          created_at?: string | null
          date?: string
          humidity?: number
          id?: string
          notes?: string | null
          pressure?: number | null
          symptom_severity?: number | null
          temperature?: number
          user_id?: string
          weather_condition?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
