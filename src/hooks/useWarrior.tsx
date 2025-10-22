// import { useQuery } from "@tanstack/react-query";
// import {
//   getHydration,
//   getMedications,
//   getMeals,
//   getMood,
//   getRiskLevel,
//   getNextAppointment,
//   getCircleMembers,
// } from "@/services/warriorService";

// export function useWarriorData(userId: string) {
//   const hydrationQuery = useQuery({
//     queryKey: ["hydration", userId],
//     queryFn: () => getHydration(userId),
//   });

//   const medicationQuery = useQuery({
//     queryKey: ["medications", userId],
//     queryFn: () => getMedications(userId),
//   });

//   const mealsQuery = useQuery({
//     queryKey: ["meals", userId],
//     queryFn: () => getMeals(userId),
//   });

//   const moodQuery = useQuery({
//     queryKey: ["mood", userId],
//     queryFn: () => getMood(userId),
//   });

//   const riskQuery = useQuery({
//     queryKey: ["riskLevel", userId],
//     queryFn: () => getRiskLevel(userId),
//   });

//   const appointmentQuery = useQuery({
//     queryKey: ["nextAppointment", userId],
//     queryFn: () => getNextAppointment(userId),
//   });

//   const circleQuery = useQuery({
//     queryKey: ["circle", userId],
//     queryFn: () => getCircleMembers(userId),
//   });

//   return {
//     hydrationQuery,
//     medicationQuery,
//     mealsQuery,
//     moodQuery,
//     riskQuery,
//     appointmentQuery,
//     circleQuery,
//   };
// }

import { useQueries } from "@tanstack/react-query";
import { fetchTable } from "@services/dataService.ts";

export function useWarriorData(userId: string) {
  const results = useQueries({
    queries: [
      { queryKey: ["appointments", userId], queryFn: () => fetchTable("appointments", userId) },
      { queryKey: ["chat_logs", userId], queryFn: () => fetchTable("chat_logs", userId) },
      { queryKey: ["circle_invites", userId], queryFn: () => fetchTable("circle_invites", userId) },
      { queryKey: ["circle_members", userId], queryFn: () => fetchTable("circle_members", userId) },
      { queryKey: ["circles", userId], queryFn: () => fetchTable("circles", userId) },
      { queryKey: ["crisis_logs", userId], queryFn: () => fetchTable("crisis_logs", userId) },
      { queryKey: ["hydration_logs", userId], queryFn: () => fetchTable("hydration_logs", userId) },
      { queryKey: ["meals", userId], queryFn: () => fetchTable("meals", userId) },
      { queryKey: ["medication_logs", userId], queryFn: () => fetchTable("medication_logs", userId) },
      { queryKey: ["medications", userId], queryFn: () => fetchTable("medications", userId) },
      { queryKey: ["profiles", userId], queryFn: () => fetchTable("profiles", userId) },
      { queryKey: ["weather_logs"], queryFn: () => fetchTable("weather_logs") }, // global
    ],
  });

  const isLoading = results.some((q) => q.isLoading);
  const isError = results.some((q) => q.isError);

  const data = Object.fromEntries(
    results.map((q, i) => [
      [
        "appointments",
        "chat_logs",
        "circle_invites",
        "circle_members",
        "circles",
        "crisis_logs",
        "hydration_logs",
        "meals",
        "medication_logs",
        "medications",
        "profiles",
        "weather_logs",
      ][i],
      q.data,
    ])
  );

  return { data, isLoading, isError };
}
