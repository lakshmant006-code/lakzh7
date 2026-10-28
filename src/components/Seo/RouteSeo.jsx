import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seo from "../../seo/routes.json";

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Keeps the title, description, canonical and social tags in step with the page as visitors move between routes. */
export default function RouteSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const r = seo.routes[path === "/google-creative" ? "/" : path];
    if (!r) { document.title = `Page not found | ${seo.name}`; return; }
    const url = seo.site + (path === "/" ? "/" : path), img = seo.site + (r.image || seo.defaultImage);
    document.title = r.title;
    setMeta('meta[name="description"]', "content", r.description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", r.title);
    setMeta('meta[property="og:description"]', "content", r.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[name="twitter:title"]', "content", r.title);
    setMeta('meta[name="twitter:description"]', "content", r.description);
    setMeta('meta[name="twitter:image"]', "content", img);
  }, [pathname]);
  return null;
}
