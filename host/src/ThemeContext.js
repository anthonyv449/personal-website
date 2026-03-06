import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeContext);
}
