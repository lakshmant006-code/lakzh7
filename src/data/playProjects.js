// Play Projects Data
// Size options: "tall" (2 rows), "short" (1 row)
// All media is served locally from public/projects/<id>/

export const playProjects = [
  {
    id: "concentrix",
    size: "tall",
    theme: "white",
    tags: ["Web Design", "Motion Graphics"],
    category: "digital",
    media: {
      video: "/projects/concentrix/concentrix.mp4",
      poster: "/projects/concentrix/poster.jpg",
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
    size: "short",
    theme: "white",
    tags: ["ASCII Art", "Creative Coding"],
    category: "digital",
    media: {
      video: "/projects/ascii-studio/ascii%20art.mp4",
      poster: "/projects/ascii-studio/poster.jpg",
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
    size: "short",
    theme: "white",
    tags: ["Digital Art", "Illustration"],
    category: "digital",
    media: {
      video: "/projects/sketches/SKETCHES.mp4",
      poster: "/projects/sketches/poster.jpg",
    },
    actions: [
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://app.notion.com/p/Art-Page-28f21a632bd480e4a525d282d22e3ec3?source=copy_link",
      },
    ],
  },
];
