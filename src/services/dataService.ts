// dataLayer.ts
// Single-file data layer (Format B)
// Put this file in your services directory (e.g., src/services/dataLayer.ts)
// Uses the same supabase client import path you already have in the project.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/supabase";
import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";

/* ------------------------------------------------------------------
  // region: NOTES & INSTRUCTIONS

  - This file intentionally groups related functions with "// region" comments
    so you can mentally split it into separate file roles (types, svc, hooks, usage).
  - Keep the import path for supabase as-is (we use "@/integrations/supabase/client").
  - Replace `any` with explicit interfaces later as you prefer.
  - React Query keys: we use ['tableName', maybe userId] as a convention.
  - For date-based logs (hydration, meals, medication_logs) we assume a `date` column
    using ISO 'YYYY-MM-DD' format and `user_id` exists on each record.
  - The file contains "example usage" near the bottom — you can copy that code into
    your components (e.g., WarriorHomePage.tsx) or call the exported hooks directly.

  ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
  // region: Generic CRUD helpers
  Generic wrappers around Supabase REST client for simple CRUD operations.
  These return { data, error } similar to Supabase patterns.
  ------------------------------------------------------------------ */

// SINGLE FETCH FOR WARRIOR DASHBOARD DATA
type Tables = Database["public"]["Tables"];
type Row<K extends keyof Tables> = Tables[K]["Row"];

export async function readItems<T extends keyof Tables>(
  table: T,
  opts?: { userId?: string; filter?: Partial<Row<T>>; limit?: number }
): Promise<{ data: Row<T>[] | null; error: any }> {
  try {
    let q = supabase.from(table).select("*");

    if (opts?.userId)
      //&& "user_id" in (await supabase.from(table).select("*").limit(1)).data?.[0] ?? {})
      q = q.eq("user_id", opts.userId);

    if (opts?.filter)
      for (const key of Object.keys(opts.filter))
        q = q.eq(key, (opts.filter as any)[key]);

    if (opts?.limit) q = q.limit(opts.limit);

    const { data, error } = await q;
    return { data: data as Row<T>[], error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function readSingleItemById(table: string, id: string | number) {
  try {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createItem(table: string, payload: any) {
  try {
    const { data, error } = await supabase.from(table).insert(payload).select();
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function upsertItem(table: string, payload: any, onConflict?: string | string[]) {
  // Supabase upsert will use primary key or constraints to deduplicate.
  // Provide `onConflict` if you want to specify a unique key (e.g., ['user_id', 'date'])
  try {
    const query = supabase.from(table).upsert(payload);
    if (onConflict) (query as any).onConflict(onConflict);
    const { data, error } = await (query as any).select();
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateItem(table: string, idOrFilter: any, payload: any) {
  try {
    // idOrFilter may be a single id or an object of filters
    let q = supabase.from(table).update(payload);
    if (typeof idOrFilter === "string" || typeof idOrFilter === "number") {
      q = q.eq("id", idOrFilter);
    } else if (typeof idOrFilter === "object") {
      for (const k of Object.keys(idOrFilter)) q = (q as any).eq(k, idOrFilter[k]);
    }
    const { data, error } = await (q as any).select();
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteItem(table: string, idOrFilter: any) {
  try {
    let q = supabase.from(table).delete();
    if (typeof idOrFilter === "string" || typeof idOrFilter === "number") {
      q = q.eq("id", idOrFilter);
    } else if (typeof idOrFilter === "object") {
      for (const k of Object.keys(idOrFilter)) q = (q as any).eq(k, idOrFilter[k]);
    }
    const { data, error } = await (q as any);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/* ------------------------------------------------------------------
  // region: Higher level helpers (app-specific)
  Example: Reset today's daily logs for a user.
  ------------------------------------------------------------------ */

/**
 * Reset the daily logs (hydration_logs, medication_logs, meals) for the given user for a given date.
 * - dateStr should be 'YYYY-MM-DD'. If omitted, defaults to today.
 * - The implementation uses update to set counters to zero.
 * - This is a single helper to be used by a mutation in the UI.
 */
export async function resetDailyLogsForUser(userId: string, dateStr?: string) {
  const date = dateStr || new Date().toISOString().split("T")[0];
  try {
    // Hydration
    await supabase
      .from("hydration_logs")
      .update({ glasses_drank: 0 })
      .eq("user_id", userId)
      .eq("date", date);

    // Medication
    await supabase
      .from("medication_logs")
      .update({ doses_taken: 0 })
      .eq("user_id", userId)
      .eq("date", date);

    // Meals
    await supabase
      .from("meals")
      .update({ meals_eaten: 0 })
      .eq("user_id", userId)
      .eq("date", date);

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/* ------------------------------------------------------------------
  // region: React Query hooks (generic)
  Generic hooks to fetch and mutate by table name.
  ------------------------------------------------------------------ */

/**
 * useFetchTable
 * - table: string
 * - options: { userId?, enabled?, limit?, staleTime? }
 *
 * Returns typical useQuery result. Query key: ['table', userId?]
 */
export function useFetchTable(table: string, options?: { userId?: string; enabled?: boolean; limit?: number; staleTime?: number }) {
  const key = options?.userId ? [table, options.userId] : [table];
  return useQuery(
    key,
    async () => {
      const { data, error } = await readItems(table, { userId: options?.userId, limit: options?.limit });
      if (error) throw error;
      return data;
    },
    {
      enabled: options?.enabled ?? !!options?.userId, // by default only fetch when userId present
      staleTime: options?.staleTime ?? 1000 * 60 * 0.5, // 30s default
    }
  );
}

/**
 * useCreate (generic)
 * - returns a mutation that calls createItem and invalidates the table query key on success.
 */
export function useCreate(table: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data, error } = await createItem(table, payload);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, _variables) => {
        queryClient.invalidateQueries({ queryKey: [table] });
        // If you use user-specific query keys, consider invalidating [table, userId] too in your component.
      },
    }
  );
}

/**
 * useUpsert (generic)
 * - handy for "update or insert" patterns (like your hydration upsert)
 * - onConflict can be provided (e.g., ['user_id', 'date'])
 */
export function useUpsert(table: string, onConflict?: string | string[]) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data, error } = await upsertItem(table, payload, onConflict);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        // invalidation: try to infer userId from variables
        const userId = Array.isArray(variables) ? variables[0]?.user_id : variables?.user_id;
        if (userId) queryClient.invalidateQueries({ queryKey: [table, userId] });
        queryClient.invalidateQueries({ queryKey: [table] });
      },
    }
  );
}

/**
 * useUpdate (generic)
 */
export function useUpdate(table: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ idOrFilter, payload }: { idOrFilter: any; payload: any }) => {
      const { data, error } = await updateItem(table, idOrFilter, payload);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        // invalidate broad keys (component can invalidate more specific)
        queryClient.invalidateQueries({ queryKey: [table] });
        // if variables.idOrFilter had user_id, invalidate that too
        const userId = variables?.idOrFilter?.user_id || variables?.payload?.user_id;
        if (userId) queryClient.invalidateQueries({ queryKey: [table, userId] });
      },
    }
  );
}

/**
 * useDelete (generic)
 */
export function useDelete(table: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (idOrFilter: any) => {
      const { data, error } = await deleteItem(table, idOrFilter);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: [table] });
        if (variables?.user_id) queryClient.invalidateQueries({ queryKey: [table, variables.user_id] });
      },
    }
  );
}

/* ------------------------------------------------------------------
  // region: App-specific React Query hooks & convenience mutations
  These mirror the mutations you already have in WarriorHomePage (hydration, meds, meals),
  but are more generic and reusable.
  ------------------------------------------------------------------ */

/**
 * useDailyLogUpsert
 * - table: 'hydration_logs' | 'medication_logs' | 'meals'
 * - onConflict: typically ['user_id', 'date'] so upsert works by (user_id, date)
 *
 * Example usage:
 * const upsertHydration = useDailyLogUpsert('hydration_logs');
 * upsertHydration.mutate({ user_id, date: '2025-10-22', glasses_drank: 3, target_glasses: 8 });
 */
export function useDailyLogUpsert(table: string) {
  // default onConflict is ['user_id', 'date'] for daily logs
  return useUpsert(table, ["user_id", "date"]);
}

/**
 * useResetDailyLogs
 * - convenience hook that wraps resetDailyLogsForUser
 */
export function useResetDailyLogs() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userId, date }: { userId: string; date?: string }) => {
      const r = await resetDailyLogsForUser(userId, date);
      if (!r.ok) throw r.error;
      return r;
    },
    {
      onSuccess: (_data, variables) => {
        const userId = variables?.userId;
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ["hydration_logs", userId] });
          queryClient.invalidateQueries({ queryKey: ["medication_logs", userId] });
          queryClient.invalidateQueries({ queryKey: ["meals", userId] });
        }
      },
    }
  );
}

/* ------------------------------------------------------------------
  // region: Example convenience wrappers that exactly match your current code shape
  These are provided so you can copy/paste directly into WarriorHomePage with minimal changes.
  ------------------------------------------------------------------ */

/**
 * Example: create hydration increment/decrement mutation similar to your previous code.
 *
 * Usage:
 * const updateHydration = useHydrationIncrementMutation();
 * updateHydration.mutate({ userId, increment: true });
 *
 * This will:
 * - compute today's date,
 * - pull current known value if provided (you can pass current),
 * - upsert using ['user_id', 'date'] conflict so it creates or updates a row,
 * - automatically invalidates the ['hydration_logs', userId] query.
 *
 * Note: If you already fetch the current hydration row and pass it in the mutate variables
 * (payload.current), this function will use it to compute the new value. Otherwise it simply
 * upserts the passed new value.
 */
export function useHydrationIncrementMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userId, increment, current, target }: { userId: string; increment: boolean; current?: number; target?: number }) => {
      const today = new Date().toISOString().split("T")[0];
      const currentVal = typeof current === "number" ? current : 0;
      const newValue = increment ? currentVal + 1 : Math.max(0, currentVal - 1);
      const payload = {
        user_id: userId,
        date: today,
        glasses_drank: newValue,
        target_glasses: target ?? 8,
      };
      // upsert on unique (user_id, date)
      const { data, error } = await upsertItem("hydration_logs", payload, ["user_id", "date"]);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["hydration_logs", variables.userId] });
      },
    }
  );
}

export function useMedicationIncrementMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userId, increment, current, target }: { userId: string; increment: boolean; current?: number; target?: number }) => {
      const today = new Date().toISOString().split("T")[0];
      const currentVal = typeof current === "number" ? current : 0;
      const newValue = increment ? currentVal + 1 : Math.max(0, currentVal - 1);
      const payload = {
        user_id: userId,
        date: today,
        doses_taken: newValue,
        target_doses: target ?? 3,
      };
      const { data, error } = await upsertItem("medication_logs", payload, ["user_id", "date"]);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["medication_logs", variables.userId] });
      },
    }
  );
}

export function useMealsIncrementMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userId, increment, current, target }: { userId: string; increment: boolean; current?: number; target?: number }) => {
      const today = new Date().toISOString().split("T")[0];
      const currentVal = typeof current === "number" ? current : 0;
      const newValue = increment ? currentVal + 1 : Math.max(0, currentVal - 1);
      const payload = {
        user_id: userId,
        date: today,
        meals_eaten: newValue,
        target_meals: target ?? 3,
      };
      const { data, error } = await upsertItem("meals", payload, ["user_id", "date"]);
      if (error) throw error;
      return data;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["meals", variables.userId] });
      },
    }
  );
}

/* ------------------------------------------------------------------
  // region: Usage Examples & Implementation Tips (copy into components)
  ------------------------------------------------------------------ */

/*

1) Fetching a table in a component (e.g., profiles for a user):

const { data: profiles, isLoading, isError } = useFetchTable('profiles', { userId, enabled: !!userId });

- data will be an array of rows or undefined.

2) Using the hydration mutation (example mirroring your earlier code):

const updateHydration = useHydrationIncrementMutation();

// to increment:
updateHydration.mutate({ userId, increment: true, current: hydration?.glasses_drank, target: hydration?.target_glasses });

// to decrement:
updateHydration.mutate({ userId, increment: false, current: hydration?.glasses_drank });

3) Reset daily logs (copy/paste from your Reset button handler):

const resetDailyLogs = useResetDailyLogs();

resetDailyLogs.mutate({ userId }); // will reset today's logs and invalidate queries

4) Generic create/update/delete (table-agnostic):

const createProfiles = useCreate('profiles'); // returns mutation
createProfiles.mutate({ user_id: userId, name: 'Ben', email: 'ben@example.com' });

const updateProfiles = useUpdate('profiles');
updateProfiles.mutate({ idOrFilter: { id: profileId }, payload: { name: 'New name' } });

const deleteProfile = useDelete('profiles');
deleteProfile.mutate(profileId); // or { id: profileId }

5) Query keys & invalidation tips:

- When calling mutations, prefer passing the same `userId` inside the payload or as part of mutation variables.
  The generic onSuccess handlers try to invalidate both [table] and [table, userId] when userId is present.

- If you want stricter caching rules, pass `staleTime` to useFetchTable or implement optimistic updates in mutations.

6) Concurrency / Race Conditions:

- For daily logs, because you're upserting with ['user_id', 'date'] conflict, concurrent increments will not reliably add (they'll overwrite).
  If you need safe concurrent increments, implement server-side RPC that performs an atomic increment, or use Postgres function.

7) TypeScript / Types:

- Add interfaces like:
  interface HydrationLog { id?: number; user_id: string; date: string; glasses_drank: number; target_glasses?: number; }
  Then replace `any` with explicit types in the exported functions & hooks.

*/

/* ------------------------------------------------------------------
  // endregion
  // file exports (export everything useful)
  ------------------------------------------------------------------ */

export default {
  // crud
  readItems,
  readSingleItemById,
  createItem,
  upsertItem,
  updateItem,
  deleteItem,

  // high-level
  resetDailyLogsForUser,

  // generic hooks
  useFetchTable,
  useCreate,
  useUpsert,
  useUpdate,
  useDelete,

  // daily log helpers
  useDailyLogUpsert,
  useResetDailyLogs,

  // example mutations
  useHydrationIncrementMutation,
  useMedicationIncrementMutation,
  useMealsIncrementMutation,
};
