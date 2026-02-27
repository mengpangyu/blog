# Assets

This directory is served by VitePress as static assets (mapped to the site root).

## Convention

- Put assets under `docs/public/assets/<module>/...`
- Reference them in Markdown using an absolute path: `/assets/<module>/...`

Examples:

```md
![BFC](/assets/fe/css/bfc.png)

<img src="/assets/interview/net/http-2.png" alt="HTTP/2" width="640" />
```

## Modules

- `fe/` Frontend
- `ai/` AI
- `interview/` Interview notes
- `project/` Projects
- `resource/` Resources
