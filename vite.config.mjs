import { defineConfig } from "vite";
import path from "path";
export default defineConfig({
    esbuild: {},
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
