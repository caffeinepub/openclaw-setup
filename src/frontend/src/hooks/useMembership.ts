import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MembershipRecord, MembershipStats } from "../backend.d";
import { MembershipTier } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export { MembershipTier };

export function useMyMembership() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<MembershipRecord | null>({
    queryKey: ["myMembership"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyMembership();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });
}

export function useTotalMembersCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalMembersCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalMembersCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMembershipStats() {
  const { actor, isFetching } = useActor();
  return useQuery<MembershipStats>({
    queryKey: ["membershipStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalGold: BigInt(0),
          totalSilver: BigInt(0),
          totalPlatinum: BigInt(0),
          totalMembers: BigInt(0),
        };
      return actor.getMembershipStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function usePurchaseMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: MembershipTier) => {
      if (!actor) throw new Error("Actor not available");
      return actor.purchaseMembership(tier);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myMembership"] });
      void queryClient.invalidateQueries({ queryKey: ["totalMembersCount"] });
      void queryClient.invalidateQueries({ queryKey: ["membershipStats"] });
    },
  });
}
