"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserPublic } from "@/lib/types";

type AuthState = {
  token: string | null;
  user: UserPublic | null;
  hydrated: boolean;
  setAuth: (token: string, user: UserPublic) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "ga-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function useIsAuthenticated() {
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  return { isAuthenticated: Boolean(token), hydrated };
}
