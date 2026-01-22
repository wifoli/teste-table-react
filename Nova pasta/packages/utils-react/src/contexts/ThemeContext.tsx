import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocalStorage } from "../hooks";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
    const [storedTheme, setStoredTheme] = useLocalStorage<Theme>("theme", defaultTheme);
    const [theme, setTheme] = useState<Theme>(storedTheme);

    useEffect(() => {
        setStoredTheme(theme);

        // Apply theme to document
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme, setStoredTheme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme precisa ser usado dentro de um ThemeProvider");
    }
    return context;
}
