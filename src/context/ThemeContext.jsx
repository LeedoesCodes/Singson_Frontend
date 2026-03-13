import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Force light mode as default, regardless of system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // If no saved theme, default to 'light' NOT 'system'
    return savedTheme || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes ONLY if theme is set to 'system'
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
