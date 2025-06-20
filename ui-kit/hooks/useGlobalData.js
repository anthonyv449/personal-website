import { create } from "zustand";
import { useEnvStore, withApiPath } from "./useEnv";

export const useGlobalData = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loadUser: async () => {
    const { apiPath } = useEnvStore.getState();
    if (!apiPath) return;
    try {
      const res = await fetch(withApiPath("/auth/me"), { credentials: "include" });
      const data = res.ok ? await res.json() : null;
      set({ user: data });
    } catch (err) {
      console.error("Error loading user", err);
      set({ user: null });
    }
  },
  logoutUser: async () => {
    const { apiPath } = useEnvStore.getState();
    if (!apiPath) return;
    try {
      await fetch(withApiPath("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error logging out", err);
    } finally {
      set({ user: null });
    }
  },
}));
