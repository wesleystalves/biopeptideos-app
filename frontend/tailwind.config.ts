import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                    950: "#082f49",
                },
                accent: {
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                },
                dark: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#050d1a",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(135deg, #050d1a 0%, #0c4a6e 50%, #082f49 100%)",
                "card-gradient": "linear-gradient(145deg, rgba(14,165,233,0.05) 0%, rgba(16,185,129,0.05) 100%)",
            },
            boxShadow: {
                glow: "0 0 20px rgba(14, 165, 233, 0.3)",
                "glow-accent": "0 0 20px rgba(16, 185, 129, 0.25)",
                card: "0 4px 24px rgba(0,0,0,0.3)",
            },
            animation: {
                "pulse-slow": "pulse 3s ease-in-out infinite",
                "fade-in": "fadeIn 0.3s ease-in-out",
                "slide-up": "slideUp 0.4s ease-out",
            },
            keyframes: {
                fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
                slideUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
            },
        },
    },
    plugins: [],
};

export default config;
