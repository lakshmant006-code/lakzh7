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
- Vercel serverless functions for the garden API (`api/`)

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
├── api/           # Vercel serverless functions
├── server/        # Shared server logic (Supabase, Gemini)
└── vercel.json    # Vercel deployment config
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import **My-portfolio**.
3. Vercel auto-detects Vite — keep the defaults from `vercel.json`.
4. Add environment variables if using the garden/flower API:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (for flower generation)
5. Deploy.

## Case studies & work

- Hiku — hiking app UX & design system
- Venmo, Quiz AI, Time Management, and more
- Playground — interactive experiments and side projects

## License

Private portfolio project. All rights reserved.
