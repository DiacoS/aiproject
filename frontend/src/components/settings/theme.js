// src/components/settings/theme.js

const THEME_KEY = "theme";

export function applyTheme(theme) {
    const root = document.documentElement;

    // Fjern dark hver gang – lys er default
    root.classList.remove("dark");

    if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
    } else if (theme === "light") {
        // Lys = ingen dark-klasse
        localStorage.setItem(THEME_KEY, "light");
    } else {
        // system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.classList.add("dark");
        localStorage.setItem(THEME_KEY, "system");
    }
}

// Kald denne én gang ved app-start
export function loadInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "system";
    applyTheme(saved);
}
