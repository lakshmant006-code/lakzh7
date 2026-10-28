// After `vite build`: writes a crawlable HTML file per route (own title, description,
// canonical, social tags, structured data and a text summary) plus sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const cfg = JSON.parse(readFileSync(join(root, "src/seo/routes.json"), "utf8"));
const base = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function page(path, r) {
  const url = cfg.site + (path === "/" ? "/" : path);
  const img = cfg.site + (r.image || cfg.defaultImage);
  let html = base;
  const set = (re, to) => { if (!re.test(html)) throw new Error("seo-build: missing " + re); html = html.replace(re, to); };
  set(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`);
  set(/<meta name="description" content="[^"]*" ?\/?>/, `<meta name="description" content="${esc(r.description)}" />`);
  set(/<link rel="canonical" href="[^"]*" ?\/?>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta property="og:title" content="[^"]*" ?\/?>/, `<meta property="og:title" content="${esc(r.title)}" />`);
  set(/<meta property="og:description" content="[^"]*" ?\/?>/, `<meta property="og:description" content="${esc(r.description)}" />`);
  set(/<meta property="og:url" content="[^"]*" ?\/?>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta property="og:image" content="[^"]*" ?\/?>/, `<meta property="og:image" content="${img}" />`);
  set(/<meta name="twitter:title" content="[^"]*" ?\/?>/, `<meta name="twitter:title" content="${esc(r.title)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" ?\/?>/, `<meta name="twitter:description" content="${esc(r.description)}" />`);
  set(/<meta name="twitter:image" content="[^"]*" ?\/?>/, `<meta name="twitter:image" content="${img}" />`);
  if (r.case) {
    const ld = { "@context": "https://schema.org", "@type": "CreativeWork", name: r.heading, description: r.description, url, image: img, author: { "@type": "Person", name: cfg.name, url: cfg.site } };
    const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: cfg.site + "/" },
      { "@type": "ListItem", position: 2, name: "Work", item: cfg.site + "/work" },
      { "@type": "ListItem", position: 3, name: r.heading, item: url } ] };
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n<script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n</head>`);
  }
  // readable text for crawlers and link previews; React replaces it the moment the app mounts
  const links = Object.entries(cfg.routes).filter(([p]) => p !== path).map(([p, x]) => `<li><a href="${p}">${esc(x.heading)}</a></li>`).join("");
  const fallback = `<main class="seo-fallback"><h1>${esc(r.heading)}</h1><p>${esc(r.description)}</p><nav aria-label="Site"><ul>${links}</ul></nav></main>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  return html;
}

for (const [path, r] of Object.entries(cfg.routes)) {
  const out = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(path, r));
}
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(cfg.routes).map((p) => `  <url><loc>${cfg.site}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod><priority>${p === "/" ? "1.0" : r(p)}</priority></url>`).join("..");
function r(p) { return cfg.routes[p].case ? "0.8" : "0.6"; }
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`seo-build: ${Object.keys(cfg.routes).length} routes + sitemap.xml`);
