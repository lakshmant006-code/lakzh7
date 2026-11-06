// Play Projects Data
// Size options: "tall" (2 rows), "short" (1 row)
// All media is served locally from public/projects/<id>/

export const playProjects = [
  {
    id: "f1",
    title: "Celestera",
    size: "short",
    theme: "black",
    tags: ["Creative Coding"],
    category: "digital",
    media: {
      image: "/projects/f1/thumbnail.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://www.celestera.online/?utm_source=portfolio&utm_medium=playground",
      },
    ],
  },
  {
    id: "concentrix",
    title: "Concentrix",
    size: "tall",
    theme: "white",
    tags: ["Web Design", "Motion Graphics"],
    category: "digital",
    media: {
      image: "/projects/concentrix/poster.webp",   // the video file was never added to the repo, so the poster stands in
      staticThumbnail: true,
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://www.figma.com/proto/T3Py9KzBBxkpkW2RfuAYRt/concentrix?page-id=0%3A1&node-id=96-3160&p=f&viewport=30%2C220%2C0.02&t=H80dUFNbDcyAQiil-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=86%3A479",
      },
    ],
  },
  {
    id: "morph-idea",
    title: "Morph Idea",
    size: "short",
    theme: "white",
    tags: ["Interaction Design", "Neumorphism"],
    category: "digital",
    media: {
      video: "/projects/morph-idea/morph%20idea.mp4",
      eager: true,
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://morph-idea.vercel.app/",
      },
    ],
  },
  {
    id: "ascii-studio",
    title: "ASCII Studio",
    size: "short",
    theme: "white",
    tags: ["ASCII Art", "Creative Coding"],
    category: "digital",
    media: {
      video: "/projects/ascii-studio/ascii%20art.mp4",
      poster: "/projects/ascii-studio/poster.webp",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://ascii-studio-one.vercel.app/",
      },
    ],
  },
  {
    id: "sketches",
    title: "Claude Code Keypad",
    size: "short",
    theme: "white",
    tags: ["3D Design", "Product Render"],
    category: "digital",
    media: {
      video: "/projects/sketches/keypad.mp4",
      poster: "/projects/sketches/keypad-poster.jpg",
    },
    actions: [],
  },
];
