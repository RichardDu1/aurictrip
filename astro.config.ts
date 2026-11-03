import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// 纯静态站点：不再使用 @astrojs/cloudflare 适配器（它生成的 _worker.js 会把任何不存在的地址
// 以 200 返回首页，造成软 404，并让 robots.txt / sitemap 也变成首页）。
// build.format = "file"：输出 /journeys/x.html，Cloudflare Pages 以无斜杠地址直接 200 返回，
// 与 canonical / sitemap 保持一致；带斜杠的旧地址由 Pages 自动 308 到无斜杠版本。
export default defineConfig({
  site: "https://aurictrip.com",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss() as any],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@styles": "/src/styles",
        "@assets": "/src/assets",
        "@content": "/src/content",
        "@lib": "/src/lib",
      },
    },
  },
});
