// import { supabase } from "@/lib/supabaseClient";

// export async function getHydration(userId: string) {
//   const { data, error } = await supabase
//     .from("hydration_logs")
//     .select("*")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1);
//   if (error) throw error;
//   return data?.[0];
// }

// export async function getMedications(userId: string) {
//   const { data, error } = await supabase
//     .from("medications")
//     .select("*")
//     .eq("user_id", userId);
//   if (error) throw error;
//   return data;
// }

// export async function getMeals(userId: string) {
//   const { data, error } = await supabase
//     .from("meals")
//     .select("*")
//     .eq("user_id", userId);
//   if (error) throw error;
//   return data;
// }

// export async function getMood(userId: string) {
//   const { data, error } = await supabase
//     .from("moods")
//     .select("*")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1);
//   if (error) throw error;
//   return data?.[0];
// }

// export async function getRiskLevel(userId: string) {
//   const { data, error } = await supabase
//     .from("risk_levels")
//     .select("level")
//     .eq("user_id", userId)
//     .single();
//   if (error) throw error;
//   return data;
// }

// export async function getNextAppointment(userId: string) {
//   const { data, error } = await supabase
//     .from("appointments")
//     .select("*")
//     .eq("user_id", userId)
//     .gte("date", new Date().toISOString())
//     .order("date", { ascending: true })
//     .limit(1);
//   if (error) throw error;
//   return data?.[0];
// }

// export async function getCircleMembers(userId: string) {
//   const { data, error } = await supabase
//     .from("circles")
//     .select("member_name, online_status")
//     .eq("owner_id", userId);
//   if (error) throw error;
//   return data;
// }

// SINGLE FETCH FOR WARRIOR DASHBOARD DATA
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];
type Row<K extends keyof Tables> = Tables[K]["Row"];

export const fetchTable = async <T extends keyof Tables>(
  table: T,
  userId?: string
): Promise<Row<T>[]> => {
  let query = supabase.from(table).select("*");

  if (userId && "user_id" in (await supabase.from(table).select("*").limit(1)).data?.[0] ?? {}) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Row<T>[];
};

