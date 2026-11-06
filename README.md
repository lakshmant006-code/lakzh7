# Lakshman Thota — Portfolio

Personal portfolio site for **Lakshman Thota**, UX Designer/Researcher. Showcases case studies, playground experiments, and interactive work.

**Live site:** Deploy via [Vercel](https://vercel.com) (see below)

**Repository:** [github.com/lakshmant006-code/My-portfolio](https://github.com/lakshmant006-code/My-portfolio)

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS](https://tailwindcss.com/) + custom CSS
- [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/) for animation
- [Three.js](https://threejs.org/) / React Three Fiber for 3D experiences

## Getting started

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

## Project structure

```
├── src/           # React app (pages, components, data)
├── public/        # Static assets (images, videos, case study media)
└── vercel.json    # Vercel deployment config
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import **My-portfolio**.
3. Vercel auto-detects Vite — keep the defaults from `vercel.json`.
4. Deploy.

## Case studies & work

- Hiku — hiking app UX & design system
- Venmo, Quiz AI, Time Management, and more
- Playground — interactive experiments and side projects

## License

Private portfolio project. All rights reserved.

## Hands gallery (drawings from the hand canvas)

People draw accessories and nail paints on the hand (nav hand button); **Add to the gallery** saves the strokes and `/hands` shows everyone's.

- Backend: `api/hand-drawings.js` (list and save) and `api/hand-drawing.js` (one picture), using `server/hand-store.js`.
- Storage: **Supabase**. `supabase/migrations/` creates the `hand_drawings` table and the private `hands` storage bucket; the GitHub integration applies it when `master` is merged.
- Vercel environment variables (server only, never in the browser): `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Without those, it falls back to Vercel Blob (`BLOB_READ_WRITE_TOKEN`), and in local development to memory.
