import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Post } from "../types";

// Query key factories
export const postListKey = (sort: string) => ["posts", sort] as const;
export const postDetailKey = (postId: string | undefined) => ["post", postId] as const;
export const communityPostsKey = (name: string | undefined, sort: string) => ["community-posts", name, sort] as const;
export const userPostsKey = (username: string | undefined, tab: string) => ["user-posts", username, tab] as const;

// Optimistic toggle helpers
const applyLikeToggle = (p: Post): Post => ({
  ...p,
  liked_by_me: !p.liked_by_me,
  likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
});

const applyFavouriteToggle = (p: Post): Post => ({
  ...p,
  favourited_by_me: !p.favourited_by_me,
  favourites_count: p.favourited_by_me ? p.favourites_count - 1 : p.favourites_count + 1,
});

// --- List queries ---

export const usePosts = (sort: "recent" | "top") =>
  useQuery({
    queryKey: postListKey(sort),
    queryFn: () => api.get<Post[]>(`/posts?sort=${sort}`).then(r => r.data),
  });

export const useCommunityPosts = (name: string | undefined, sort: "recent" | "top") =>
  useQuery({
    queryKey: communityPostsKey(name, sort),
    queryFn: () => api.get<Post[]>(`/communities/${name}/posts?sort=${sort}`).then(r => r.data),
    enabled: !!name,
  });

export const useUserTabPosts = (username: string | undefined, tab: "posts" | "likes" | "favourites") => {
  const endpointMap = { posts: "posts", likes: "liked", favourites: "favourited" } as const;
  return useQuery({
    queryKey: userPostsKey(username, tab),
    queryFn: () => api.get<Post[]>(`/users/u/${username}/${endpointMap[tab]}`).then(r => r.data),
    enabled: !!username,
  });
};

// --- Detail query ---

export const usePost = (postId: string | undefined) =>
  useQuery({
    queryKey: postDetailKey(postId),
    queryFn: () => api.get<Post>(`/posts/${postId}`).then(r => r.data),
    enabled: !!postId,
  });

// --- Search ---

export const useSearchPosts = (query: string) =>
  useQuery({
    queryKey: ["posts-search", query],
    queryFn: () => api.get<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`).then(r => r.data),
    enabled: query.trim().length > 1,
    staleTime: 10_000,
  });

// --- Create post ---

export const useCreatePost = (sort: "recent" | "top") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; body: string; communities: string[] }) =>
      api.post<Post>("/posts", payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: postListKey(sort) }),
  });
};

// --- Optimistic like/fav for Post[] lists ---

export const useToggleLike = (queryKey: readonly unknown[]) => {
  const qc = useQueryClient();
  return useMutation<{ liked: boolean }, Error, number, { prev: Post[] | undefined }>({
    mutationFn: (postId) =>
      api.post<{ liked: boolean }>(`/posts/${postId}/like`).then(r => r.data),
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Post[]>(queryKey);
      qc.setQueryData<Post[]>(queryKey, old => old?.map(p => p.id === postId ? applyLikeToggle(p) : p));
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useToggleFavourite = (queryKey: readonly unknown[]) => {
  const qc = useQueryClient();
  return useMutation<{ favourited: boolean }, Error, number, { prev: Post[] | undefined }>({
    mutationFn: (postId) =>
      api.post<{ favourited: boolean }>(`/posts/${postId}/favourite`).then(r => r.data),
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Post[]>(queryKey);
      qc.setQueryData<Post[]>(queryKey, old => old?.map(p => p.id === postId ? applyFavouriteToggle(p) : p));
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });
};

// --- Edit/delete for lists ---

export const useEditPost = (queryKey: readonly unknown[]) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, title, body, communities }: { postId: number; title: string; body: string; communities: string[] }) =>
      api.patch(`/posts/${postId}`, { title, body, communities }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

export const useDeletePost = (queryKey: readonly unknown[]) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => api.delete(`/posts/${postId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
};

// --- Optimistic like/fav for single post detail ---

export const useDetailToggleLike = (postId: string | undefined) => {
  const qc = useQueryClient();
  const key = postDetailKey(postId);
  return useMutation<{ liked: boolean }, Error, void, { prev: Post | undefined }>({
    mutationFn: () =>
      api.post<{ liked: boolean }>(`/posts/${postId}/like`).then(r => r.data),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Post>(key);
      qc.setQueryData<Post>(key, old => old ? applyLikeToggle(old) : old);
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
};

export const useDetailToggleFavourite = (postId: string | undefined) => {
  const qc = useQueryClient();
  const key = postDetailKey(postId);
  return useMutation<{ favourited: boolean }, Error, void, { prev: Post | undefined }>({
    mutationFn: () =>
      api.post<{ favourited: boolean }>(`/posts/${postId}/favourite`).then(r => r.data),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Post>(key);
      qc.setQueryData<Post>(key, old => old ? applyFavouriteToggle(old) : old);
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
};

// --- Edit/delete for detail ---

export const useDetailEditPost = (postId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, body, communities }: { title: string; body: string; communities: string[] }) =>
      api.patch(`/posts/${postId}`, { title, body, communities }),
    onSuccess: () => qc.invalidateQueries({ queryKey: postDetailKey(postId) }),
  });
};

export const useDetailDeletePost = (postId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(`/posts/${postId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: postDetailKey(postId) }),
  });
};
