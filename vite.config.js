import { resolve } from "path";

export default {
  root: resolve(__dirname, "src"),
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        signup: resolve(__dirname, "src/pages/signup.html"), // 👈 include this page in build
        login: resolve(__dirname, "src/pages/login.html"), // (optional) include others too
      },
    },
  },
  server: {
    port: 8080,
    open: "/pages/signup.html", // 👈 this opens signup.html on dev start
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
};
