import { create } from "zustand";

// Determine environment and default host path
export const NODE_ENV = process.env.NODE_ENV || "development";
export const HOST_PATH = NODE_ENV === "production" ? "/host" : "";

export const useEnvStore = create((set) => ({
  basePath: HOST_PATH,
  loaded: false,
  loadEnv: async () => {
    try {
      const res = await fetch("/env.json");
      if (!res.ok) throw new Error("Failed to load env.json");
      const data = await res.json();
      set({ basePath: data.basePath || HOST_PATH, loaded: true });
    } catch (err) {
      console.error("Error loading env.json", err);
      set({ loaded: true });
    }
  },
}));

export const withBasePath = (path) => {
  const { basePath } = useEnvStore.getState();
  const prefix = basePath
    ? basePath.startsWith("/")
      ? basePath
      : `/${basePath}`
    : "";
  if (path.startsWith("/")) return `${prefix}${path}`;
  return `${prefix}/${path}`;
};
