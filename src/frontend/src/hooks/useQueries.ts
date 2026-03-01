import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tender, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useTenders() {
  const { actor, isFetching } = useActor();
  return useQuery<Tender[]>({
    queryKey: ["tenders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTenders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useTenderById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Tender | null>({
    queryKey: ["tender", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getTenderById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 30_000,
  });
}

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAnalytics();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSavedTenders() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["savedTenders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSavedTenders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useSaveTender() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tenderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveTender(tenderId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["savedTenders"] });
    },
  });
}

export function useUnsaveTender() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tenderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.unsaveTender(tenderId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["savedTenders"] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: {
      name: string;
      company: string;
      industry: string;
      turnover: string;
      experience: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateUserProfile(
        profile.name,
        profile.company,
        profile.industry,
        profile.turnover,
        profile.experience,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
