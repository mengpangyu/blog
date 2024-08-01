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
      { text: "面经", link: "/interview" },
      { text: "资源", link: "/resource" },
      { text: "关于我", link: "/project" },
    ],

    sidebar: {
      "/interview": [
        {
          text: "面经",
          items: [{ text: "概览", link: "/interview" }],
        },
      ],
      "/project": [
        {
          text: "项目",
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
