// src/useEnvStore.js
import { create } from "zustand";

// ── 1) Build-time constants ────────────────────────────────────────
export const NODE_ENV = process.env.NODE_ENV || "development";
export const HOST_PATH = NODE_ENV === "production" ? "/host" : "";
export const REMOTES_PATH = "/remotes"; 
export const DEFAULT_DOMAIN =
  NODE_ENV === "production"
    ? `https://cdn.${window.location.hostname}`
    : "";
// ── 2) Zustand store ─────────────────────────────────────────────
export const useEnvStore = create((set) => ({
  domain: DEFAULT_DOMAIN,
  hostPath: HOST_PATH,
  loaded: false,
  apiPath: null,

  // optional runtime override via /env.json
  loadEnv: async () => {
    try {
      const res = await fetch("/env.json");
      if (!res.ok) throw new Error("env.json not found");
      const data = await res.json();
      set({
        domain: data.domain   || DEFAULT_DOMAIN,
        hostPath: data.hostPath || HOST_PATH,
        loaded: true,
        apiPath: data.apiPath
      });
    } catch (err) {
      console.error("Error loading env.json", err);
      set({ loaded: true });
    }
  },
}));

// ── 3) URL normalizer ─────────────────────────────────────────────
const join = (prefix, path) => {
  const p = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  const pp = path.startsWith("/")    ? path               : `/${path}`;
  return `${p}${pp}`;
};

// ── 4) Helpers ───────────────────────────────────────────────────
/** 
 * e.g. withHostPath("GradImages/foo.json")
 * → dev:  "/GradImages/foo.json"
 * → prod: "https://cdn.learningwithant.com/host/GradImages/foo.json"
 */
export const withHostPath = (path) => {
  const { domain, hostPath } = useEnvStore.getState();
  return join(domain + hostPath, path);
};

/** 
 * e.g. withRemotesPath("home/remoteEntry.js")
 * → dev:  "/remotes/home/remoteEntry.js"
 * → prod: "https://cdn.learningwithant.com/remotes/home/remoteEntry.js"
 */
export const withRemotesPath = (path) => {
  const { domain } = useEnvStore.getState();
  return join(domain + REMOTES_PATH, path);
};
