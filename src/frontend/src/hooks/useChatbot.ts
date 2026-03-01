import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatbotConfig } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useChatbotConfig() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ChatbotConfig | null>({
    queryKey: ["chatbotConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getChatbotConfig();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });
}

export function useSaveChatbotConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phoneNumber,
      enabled,
    }: {
      phoneNumber: string;
      enabled: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveChatbotConfig(phoneNumber, enabled);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chatbotConfig"] });
    },
  });
}

export function useDeleteChatbotConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteChatbotConfig();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chatbotConfig"] });
    },
  });
}
