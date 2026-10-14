import { apiRequest } from "@/lib/api/client";
import type { Comment, Paginated } from "@/lib/types";

export function getComments(postId: number, page = 1, limit = 50) {
  return apiRequest<Paginated<Comment>>(`/posts/${postId}/comments`, {
    query: { page, limit },
  });
}

export function createComment(token: string, postId: number, content: string) {
  return apiRequest<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    token,
    body: { content },
  });
}

export function updateComment(token: string, id: number, content: string) {
  return apiRequest<Comment>(`/comments/${id}`, {
    method: "PATCH",
    token,
    body: { content },
  });
}

export function deleteComment(token: string, id: number) {
  return apiRequest<Comment>(`/comments/${id}`, {
    method: "DELETE",
    token,
  });
}
