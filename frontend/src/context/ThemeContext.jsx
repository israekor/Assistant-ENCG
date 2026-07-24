import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        return savedTheme;
    }

    return THEMES.SYSTEM;
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = () => {
            root.classList.remove("light", "dark");

            if (theme === "light") {
                root.classList.add("light");
            } else if (theme === "dark") {
                root.classList.add("dark");
            } else {
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

                root.classList.add(prefersDark ? "dark" : "light");
            }
        };

        applyTheme();

        localStorage.setItem("theme", theme);

        if (theme === "system") {
            const media = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

            media.addEventListener("change", applyTheme);

            return () => media.removeEventListener("change", applyTheme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}