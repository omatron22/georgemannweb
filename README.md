# George Mann Photography

Public archive of photographs by George Mann (1905–1977), vaudeville performer and behind-the-scenes documentarian.

Built for Dianne Woods and Brad Smith (George's son). Lives at [georgemannphotography.com](https://georgemannphotography.com).

Licensing for the photographs is handled by [akg-images](https://www.akg-images.co.uk/).

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind 4
- Deployed on Vercel

## Dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Asset pipeline

- `public/images/` — originals (used in the lightbox; baked-in caption strip preserved)
- `public/images-cropped/` — bottom 7% cropped via `ffmpeg` for the grid view
- `app/captions.json` — per-photo caption + dimensions
