// src/contexts/theme.js
import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  themeMode: "light",
  darkTheme: () => {},
  lightTheme: () => {},
});

// This is just the Provider component from the context
export const ThemeProvider = ThemeContext.Provider;


export const useTheme = () => useContext(ThemeContext);
