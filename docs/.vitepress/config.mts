import { defineConfig } from 'vitepress'
import { buildSectionSidebar } from './sidebar.mts'
import path from 'node:path'

const docsRoot = path.resolve(__dirname, '..')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Canned',
  base: '/blog/',
  description: '逆水行舟，不进则退',
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '前端', link: '/frontend/' },
      { text: 'AI', link: '/ai/' },
      { text: '面经', link: '/interview/' },
    ],

    sidebar: {
      '/frontend/': buildSectionSidebar({ docsRoot, section: 'frontend', base: '/frontend/' }),
      '/ai/': buildSectionSidebar({ docsRoot, section: 'ai', base: '/ai/' }),
      '/interview/': buildSectionSidebar({ docsRoot, section: 'interview', base: '/interview/' }),
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
  },
})
