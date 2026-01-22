import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            include: ["src/**/*"],
            exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "FrontEnginePanel",
            formats: ["es"],
            fileName: () => "index.js",
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "react-router-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react-router-dom": "ReactRouterDOM",
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") return "style.css";
                    return assetInfo.name || "";
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
