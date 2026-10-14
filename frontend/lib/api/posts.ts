import { apiRequest } from "@/lib/api/client";
import type { Paginated, Post, PostFilters, PostType } from "@/lib/types";

export type CreatePostPayload = {
  title: string;
  content: string;
  type: PostType;
  gameId: number;
  platformIds: number[];
};

export type UpdatePostPayload = {
  title?: string;
  content?: string;
  type?: PostType;
  platformIds?: number[];
};

export function getPosts(filters: PostFilters = {}) {
  return apiRequest<Paginated<Post>>("/posts", {
    query: {
      gameId: filters.gameId,
      type: filters.type,
      platformId: filters.platformId,
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    },
  });
}

export function getPost(id: number) {
  return apiRequest<Post>(`/posts/${id}`);
}

export function createPost(token: string, payload: CreatePostPayload) {
  return apiRequest<Post>("/posts", {
    method: "POST",
    token,
    body: payload,
  });
}

export function updatePost(
  token: string,
  id: number,
  payload: UpdatePostPayload,
) {
  return apiRequest<Post>(`/posts/${id}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deletePost(token: string, id: number) {
  return apiRequest<Post>(`/posts/${id}`, {
    method: "DELETE",
    token,
  });
}
