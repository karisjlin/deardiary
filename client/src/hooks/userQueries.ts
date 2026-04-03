import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export interface ProfileUser {
  id: number;
  username: string;
  created_at: string;
}

export const userProfileKey = (username: string | undefined) => ["user-profile", username] as const;

export const useUserProfile = (username: string | undefined) =>
  useQuery({
    queryKey: userProfileKey(username),
    queryFn: () => api.get<ProfileUser>(`/users/u/${username}`).then(r => r.data),
    enabled: !!username,
    retry: false,
  });
