export type PostType = "BUG" | "FIX" | "IDEA";

export type UserPublic = {
  id: number;
  email?: string;
  username: string;
  displayName: string | null;
  createdAt?: string;
};

export type Platform = {
  id: number;
  name: string;
  slug: string;
};

export type Game = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  releaseDate: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  platforms: Platform[];
};

export type Post = {
  id: number;
  title: string;
  content: string;
  type: PostType;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  gameId: number;
  author: Pick<UserPublic, "id" | "username" | "displayName">;
  game: Game;
  platforms: Platform[];
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  postId: number;
  author: Pick<UserPublic, "id" | "username" | "displayName">;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};

export type AuthResponse = {
  accessToken: string;
  user: UserPublic;
};

export type PostFilters = {
  gameId?: number;
  type?: PostType;
  platformId?: number;
  page?: number;
  limit?: number;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};
