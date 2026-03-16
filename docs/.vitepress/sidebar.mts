import fs from 'node:fs'
import path from 'node:path'

export type SidebarItem = {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

type BuildOptions = {
  /** absolute path to docs root */
  docsRoot: string
  /** section directory name under docs root, e.g. 'fe' */
  section: string
  /** base route, e.g. '/fe/' */
  base: `/${string}/`
  /** extra absolute or relative-to-section paths to ignore */
  ignore?: string[]
  /** if true, build nested groups based on folder structure */
  nested?: boolean
}

const DEFAULT_IGNORES = new Set([
  '.DS_Store',
  '.vitepress',
  'node_modules',
  'dist',
  'cache',
  'public',
  'api-examples.md',
  'markdown-examples.md',
])

function isHiddenSegment(seg: string) {
  return seg.startsWith('_') || seg.startsWith('.')
}

function listDirSorted(dir: string) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
}

function stripMdExt(p: string) {
  return p.endsWith('.md') ? p.slice(0, -3) : p
}

function titleFromFile(filePath: string): { title?: string; order?: number } {
  const raw = fs.readFileSync(filePath, 'utf8')

  // frontmatter (very small parser): --- ... ---
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3)
    if (end !== -1) {
      const fm = raw.slice(3, end).split(/\r?\n/)
      let title: string | undefined
      let order: number | undefined
      for (const line of fm) {
        const mTitle = line.match(/^title:\s*(.+)\s*$/)
        if (mTitle?.[1]) title = mTitle[1].replace(/^['"]|['"]$/g, '')
        const mOrder = line.match(/^order:\s*(\d+)\s*$/)
        if (mOrder?.[1]) order = Number(mOrder[1])
      }
      // if frontmatter provided a title, we're done
      if (title) return { title, order }

      // order-only frontmatter: fall through to H1 detection
      if (order !== undefined) {
        const h1 = raw.match(/^#\s+(.+)\s*$/m)
        return { title: h1?.[1]?.trim(), order }
      }
    }
  }

  // first H1
  const h1 = raw.match(/^#\s+(.+)\s*$/m)
  if (h1?.[1]) return { title: h1[1].trim() }

  return {}
}

function humanizeSlug(name: string) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildItemsFromDir(sectionAbsDir: string, sectionRouteBase: string): SidebarItem[] {
  const entries = listDirSorted(sectionAbsDir)

  const items: Array<{ item: SidebarItem; order?: number; key: string }> = []

  // 1) files (excluding index.md)
  for (const ent of entries) {
    if (!ent.isFile()) continue
    if (!ent.name.endsWith('.md')) continue
    if (DEFAULT_IGNORES.has(ent.name)) continue
    if (isHiddenSegment(ent.name)) continue

    const full = path.join(sectionAbsDir, ent.name)
    const slug = stripMdExt(ent.name)

    if (slug === 'index') continue

    const { title, order } = titleFromFile(full)
    items.push({
      key: `file:${ent.name}`,
      order,
      item: {
        text: title ?? humanizeSlug(slug),
        link: `${sectionRouteBase}${slug}`,
      },
    })
  }

  // 2) directories
  for (const ent of entries) {
    if (!ent.isDirectory()) continue
    if (DEFAULT_IGNORES.has(ent.name)) continue
    if (isHiddenSegment(ent.name)) continue

    const dirAbs = path.join(sectionAbsDir, ent.name)
    const indexAbs = path.join(dirAbs, 'index.md')

    const indexMeta = fs.existsSync(indexAbs) ? titleFromFile(indexAbs) : {}

    const groupTitle = indexMeta.title ?? humanizeSlug(ent.name)

    const groupLink = fs.existsSync(indexAbs) ? `${sectionRouteBase}${ent.name}/` : undefined

    const children = buildItemsFromDir(dirAbs, `${sectionRouteBase}${ent.name}/`)

    // if folder has no index and no children, skip
    if (!groupLink && children.length === 0) continue

    const groupOrder = indexMeta.order

    items.push({
      key: `dir:${ent.name}`,
      order: groupOrder,
      item: {
        text: groupTitle,
        link: groupLink,
        collapsed: true,
        items: children.length ? children : undefined,
      },
    })
  }

  items.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY
    const bo = b.order ?? Number.POSITIVE_INFINITY
    if (ao !== bo) return ao - bo
    return a.key.localeCompare(b.key)
  })

  return items.map((x) => x.item)
}

export function buildSectionSidebar(opts: BuildOptions): SidebarItem[] {
  const sectionAbs = path.join(opts.docsRoot, opts.section)
  const sectionIndex = path.join(sectionAbs, 'index.md')

  const sectionTitle = fs.existsSync(sectionIndex)
    ? (titleFromFile(sectionIndex).title ?? humanizeSlug(opts.section))
    : humanizeSlug(opts.section)

  const items = buildItemsFromDir(sectionAbs, opts.base)

  return [
    {
      text: sectionTitle,
      collapsed: false,
      items: [{ text: '概览', link: opts.base }, ...items],
    },
  ]
}
