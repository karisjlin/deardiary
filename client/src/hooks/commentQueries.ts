import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Comment } from "../types";

export const commentKey = (postId: number) => ["comments", postId] as const;

export const useComments = (postId: number) =>
  useQuery({
    queryKey: commentKey(postId),
    queryFn: () => api.get<Comment[]>(`/posts/${postId}/comments`).then(r => r.data),
  });

export const useCreateComment = (postId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      api.post<Comment>(`/posts/${postId}/comments`, { body }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: commentKey(postId) }),
  });
};

export const useDeleteComment = (postId: number) => {
  const qc = useQueryClient();
  const key = commentKey(postId);
  return useMutation<unknown, Error, number, { prev: Comment[] | undefined }>({
    mutationFn: (commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Comment[]>(key);
      qc.setQueryData<Comment[]>(key, old => old?.filter(c => c.id !== commentId));
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
};
