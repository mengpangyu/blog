import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Canned",
  description: "逆水行舟，不进则退",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "技术", link: "/technology" },
      { text: "项目", link: "/project" },
      { text: "面经", link: "/interview/base/js" },
      { text: "资源", link: "/resource" },
      { text: "关于我", link: "/project" },
    ],

    sidebar: {
      "/interview": [
        {
          text: "基础",
          collapsed: false,
          items: [
            { text: "JS", link: "/interview/base/js" },
            { text: "CSS", link: "/interview/base/css" },
            { text: "HTML", link: "/interview/base/html" },
          ],
        },
        {
          text: "框架",
          collapsed: false,
          items: [
            { text: "React", link: "/interview/lib/react" },
            { text: "React Native", link: "/interview/lib/react-native" },
            { text: "Vue", link: "/interview/lib/vue" },
          ],
        },
        {
          text: "构建",
          collapsed: false,
          items: [
            { text: "WebPack", link: "/interview/build/webpack" },
            { text: "Vite", link: "/interview/build/vite" },
          ],
        },
        {
          text: "网络",
          collapsed: false,
          items: [
            { text: "HTTP", link: "/interview/net/http" },
          ],
        },
        {
          text: "其他",
          collapsed: false,
          items: [
            { text: "Other", link: "/interview/other/other" },
          ],
        },
      ],
      "/project": [
        {
          text: "项目",
          collapsed: false,
          items: [{ text: "概览", link: "/project" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },
});
