import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export interface Community {
  id: number;
  name: string;
  created_at: string;
  post_count: number;
}

export const communityListKey = ["communities"] as const;

export const useCommunities = () =>
  useQuery({
    queryKey: communityListKey,
    queryFn: () => api.get<Community[]>("/communities").then(r => r.data),
  });
