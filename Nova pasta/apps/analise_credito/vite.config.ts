import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const root = path.resolve(__dirname, "..", "..");
const panelSrc = path.resolve(root, "packages/panel/src");
const uiSrc = path.resolve(root, "packages/ui/src");
const utilsReactSrc = path.resolve(root, "packages/utils-react/src");
const tailwindConfigSrc = path.resolve(root, "packages/tailwind-config/src");

export default defineConfig(({ mode }) => {
    // const isDev = mode === "development"; // não precisamos condicionar aliases

    return {
        plugins: [
            react(),
            viteStaticCopy({
                targets: [
                    { src: "node_modules/@front-engine/assets/fonts", dest: "assets" },
                    { src: "node_modules/@front-engine/assets/images", dest: "assets" },
                ],
            }),
        ],
        resolve: {
            // aliases aplicados tanto em dev quanto em build
            alias: [
                // CSS overrides (mantém como antes)
                {
                    find: "@front-engine/panel/styles.css",
                    replacement: path.resolve(root, "packages/panel/src/styles/panel.css"),
                },
                {
                    find: "@front-engine/ui/styles.css",
                    replacement: path.resolve(root, "packages/ui/src/styles/globals.css"),
                },
                {
                    find: "@front-engine/tailwind-config/styles.css",
                    replacement: path.resolve(root, "packages/tailwind-config/styles.css"),
                },
                {
                    find: "@front-engine/utils-react/styles.css",
                    replacement: path.resolve(root, "packages/utils-react/src/styles.css"),
                },
                {
                    find: "@front-engine/assets/styles.css",
                    replacement: path.resolve(root, "packages/assets/src/styles.css"),
                },

                // package root aliases
                { find: "@front-engine/panel", replacement: panelSrc },
                { find: "@front-engine/ui", replacement: uiSrc },
                { find: "@front-engine/tailwind-config", replacement: tailwindConfigSrc },
                { find: "@front-engine/utils-react", replacement: utilsReactSrc },

                // subpath aliases (apontando para pastas)
                {
                    find: "@front-engine/utils-react/contexts",
                    replacement: path.resolve(utilsReactSrc, "contexts"),
                },
                {
                    find: "@front-engine/utils-react/components",
                    replacement: path.resolve(utilsReactSrc, "components"),
                },
                {
                    find: "@front-engine/utils-react/permissions",
                    replacement: path.resolve(utilsReactSrc, "permissions"),
                },
                {
                    find: "@front-engine/utils-react/routes",
                    replacement: path.resolve(utilsReactSrc, "routes"),
                },
                {
                    find: "@front-engine/utils-react/hooks",
                    replacement: path.resolve(utilsReactSrc, "hooks"),
                },
            ],
            // opcional: garantir resolução de extensões
            extensions: [".mjs", ".js", ".ts", ".tsx", ".jsx", ".json"],
        },
        server: {
            host: "0.0.0.0",
            port: 5001,
            strictPort: true,
            watch: { usePolling: true, interval: 1000 },
            hmr: true,
            fs: { allow: [root] },
        },
        preview: {
            host: "0.0.0.0",
            port: 5099,
            strictPort: true,
        },
    };
});
