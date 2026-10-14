import { apiRequest } from "@/lib/api/client";
import type { Platform } from "@/lib/types";

export function getPlatforms() {
  return apiRequest<Platform[]>("/platforms");
}
