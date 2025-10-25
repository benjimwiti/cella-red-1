import { useQueries } from "@tanstack/react-query";
import { readItems } from "../services/dataService";


export function useWarriorData(userId: string) {
  const results = useQueries({
    queries: [
      //{ queryKey: ["appointments", userId], queryFn: () => readItems("appointments", userId) },
      //{ queryKey: ["chat_logs", userId], queryFn: () => readItems("chat_logs", userId) },
      //{ queryKey: ["circle_invites", userId], queryFn: () => readItems("circle_invites", userId) },
      //{ queryKey: ["circle_members", userId], queryFn: () => readItems("circle_members", userId) },
      //{ queryKey: ["circles", userId], queryFn: () => readItems("circles", userId) },
      //{ queryKey: ["crisis_logs", userId], queryFn: () => readItems("crisis_logs", userId) },
      { queryKey: ["hydration_logs", userId], queryFn: () => readItems("hydration_logs", userId) },
      { queryKey: ["meals", userId], queryFn: () => readItems("meals", userId) },
      { queryKey: ["medication_logs", userId], queryFn: () => readItems("medication_logs", userId) },
      { queryKey: ["medications", userId], queryFn: () => readItems("medications", userId) },
      { queryKey: ["profiles", userId], queryFn: () => readItems("profiles", userId) },
      //{ queryKey: ["weather_logs"], queryFn: () => readItems("weather_logs") }, // global
    ],
  });

  const isLoading = results.some((q) => q.isLoading);
  const isError = results.some((q) => q.isError);

  //console.log(results);

  const data = Object.fromEntries(
    results.map((q, i) => [
      [
        //"appointments",
        //"chat_logs",
        //"circle_invites",
        //"circle_members",
        //"circles",
        //"crisis_logs",
        "hydration_logs",
        "meals",
        "medication_logs",
        "medications",
        "profiles",
        //"weather_logs",
      ][i],
      q.data?.data || [],
    ])
  );

  return { data, isLoading, isError };
}
