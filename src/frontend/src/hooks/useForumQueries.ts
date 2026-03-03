import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  ForumNotification,
  ForumPost,
  ForumThread,
  ForumTopic,
  UserAccount,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ---- Forum Topic Hooks ----

export function useForumTopics() {
  const { actor, isFetching } = useActor();
  return useQuery<ForumTopic[]>({
    queryKey: ["forumTopics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getForumTopics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useForumThreadsByTopic(topicId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ForumThread[]>({
    queryKey: ["forumThreads", topicId?.toString()],
    queryFn: async () => {
      if (!actor || topicId === null) return [];
      return actor.getForumThreadsByTopic(topicId);
    },
    enabled: !!actor && !isFetching && topicId !== null,
    staleTime: 30_000,
  });
}

export function useForumPostsByThread(threadId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ForumPost[]>({
    queryKey: ["forumPosts", threadId?.toString()],
    queryFn: async () => {
      if (!actor || threadId === null) return [];
      return actor.getForumPostsByThread(threadId);
    },
    enabled: !!actor && !isFetching && threadId !== null,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// ---- Forum Mutation Hooks ----

export function useCreateForumThread() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      topicId,
      title,
      body,
    }: {
      topicId: bigint;
      title: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createForumThread(topicId, title, body);
    },
    onSuccess: (_, { topicId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["forumThreads", topicId.toString()],
      });
      void queryClient.invalidateQueries({ queryKey: ["forumTopics"] });
    },
  });
}

export function useCreateForumPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      threadId,
      body,
    }: {
      threadId: bigint;
      body: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createForumPost(threadId, body);
    },
    onSuccess: (_, { threadId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["forumPosts", threadId.toString()],
      });
      void queryClient.invalidateQueries({ queryKey: ["forumTopics"] });
      void queryClient.invalidateQueries({ queryKey: ["forumNotifications"] });
    },
  });
}

// ---- Forum Notifications Hooks ----

export function useForumNotifications() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<ForumNotification[]>({
    queryKey: ["forumNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyForumNotifications();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useMarkForumNotificationRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markForumNotificationRead(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forumNotifications"] });
    },
  });
}

// ---- Blog Hooks ----

export function useBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ---- User Account Hooks ----

export function useMyUserAccount() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserAccount | null>({
    queryKey: ["myUserAccount"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyUserAccount();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });
}

export function useSaveUserAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      phone,
      fullName,
      handle,
    }: {
      email: string;
      phone: string;
      fullName: string;
      handle: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveUserAccount(email, phone, fullName, handle);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myUserAccount"] });
    },
  });
}
