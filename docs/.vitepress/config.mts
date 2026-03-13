import { defineConfig } from 'vitepress'
import { buildSectionSidebar } from './sidebar.mts'
import path from 'node:path'

const docsRoot = path.resolve(__dirname, '..')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '老登',
  base: '/blog/',
  description: '山高万仞，只登一步',
  appearance: 'dark',
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'one-light',
      dark: 'one-dark-pro',
    },
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '基础', link: '/base/' },
      { text: '算法', link: '/algorithm/' },
      { text: 'AI', link: '/ai/' },
      { text: '面经', link: '/interview/' },
      { text: '项目', link: '/projects/' },
      { text: '工具', link: '/tools/' },
    ],
    sidebar: {
      '/base/': buildSectionSidebar({ docsRoot, section: 'base', base: '/base/' }),
      '/algorithm/': buildSectionSidebar({ docsRoot, section: 'algorithm', base: '/algorithm/' }),
      '/ai/': buildSectionSidebar({ docsRoot, section: 'ai', base: '/ai/' }),
      '/interview/': buildSectionSidebar({ docsRoot, section: 'interview', base: '/interview/' }),
      '/projects/': buildSectionSidebar({ docsRoot, section: 'projects', base: '/projects/' }),
      '/tools/': buildSectionSidebar({ docsRoot, section: 'tools', base: '/tools/' }),
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/shangaowanren' }],
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    search: {
      provider: 'local',
    },
  },
})
