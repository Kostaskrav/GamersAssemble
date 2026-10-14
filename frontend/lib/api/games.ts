import { apiRequest } from "@/lib/api/client";
import type { Game } from "@/lib/types";

export function getGames() {
  return apiRequest<Game[]>("/games");
}

export function getGame(id: number) {
  return apiRequest<Game>(`/games/${id}`);
}
