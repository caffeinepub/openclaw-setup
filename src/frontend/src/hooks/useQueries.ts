import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Changelog,
  DownloadStats,
  FAQ,
  SavedConfig,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ---- Query Hooks ----

export function useLatestVersion() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["latestVersion"],
    queryFn: async () => {
      if (!actor) return "1.0.0";
      return actor.getLatestVersion();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useTotalDownloads() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalDownloads"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalDownloads();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useDownloadsByOS() {
  const { actor, isFetching } = useActor();
  return useQuery<DownloadStats>({
    queryKey: ["downloadsByOS"],
    queryFn: async () => {
      if (!actor)
        return {
          windowsDownloads: BigInt(0),
          macosDownloads: BigInt(0),
          linuxDownloads: BigInt(0),
          totalDownloads: BigInt(0),
        };
      return actor.getDownloadsByOS();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAllFAQs() {
  const { actor, isFetching } = useActor();
  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFAQs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAllChangelog() {
  const { actor, isFetching } = useActor();
  return useQuery<Changelog[]>({
    queryKey: ["changelog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChangelog();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useMyConfigs() {
  const { actor, isFetching } = useActor();
  return useQuery<SavedConfig[]>({
    queryKey: ["myConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConfigs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useTotalConfigsCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalConfigsCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalConfigsCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ---- Mutation Hooks ----

export function useIncrementDownload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (os: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.incrementDownload(os);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["totalDownloads"] });
      void queryClient.invalidateQueries({ queryKey: ["downloadsByOS"] });
    },
  });
}

export function useSaveConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      os,
      configData,
    }: {
      name: string;
      os: string;
      configData: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveConfig(name, os, configData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myConfigs"] });
      void queryClient.invalidateQueries({ queryKey: ["totalConfigsCount"] });
    },
  });
}

export function useDeleteConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteConfig(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myConfigs"] });
      void queryClient.invalidateQueries({ queryKey: ["totalConfigsCount"] });
    },
  });
}

export function useAddFAQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      question,
      answer,
      category,
    }: {
      question: string;
      answer: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFAQ(question, answer, category);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useDeleteFAQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteFAQ(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useAddChangelog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      version: string;
      releaseDate: string;
      title: string;
      description: string;
      changesList: string[];
      changeType: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addChangelog(
        params.version,
        params.releaseDate,
        params.title,
        params.description,
        params.changesList,
        params.changeType,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["changelog"] });
    },
  });
}

export function useDeleteChangelog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteChangelog(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["changelog"] });
    },
  });
}

// ---- User Profile Hooks ----

export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}
