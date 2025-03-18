import { createContext } from "react";
import theme from "./theme.js"; // Import shared theme

// Create a context to hold the theme
export const ThemeContext = createContext(theme);
