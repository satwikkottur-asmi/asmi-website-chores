import { useEffect } from "react";

type MetaTag = { name?: string; property?: string; content: string };

export function useDocumentMeta(title: string, meta: MetaTag[] = []) {
  // Call sites pass inline array literals → new reference every render.
  // Depending on `meta` directly would tear down and re-apply every tag on each
  // render (costly under scroll-driven animation). Key off the serialized value
  // instead, so the effect re-runs only when the tags actually change.
  const metaKey = JSON.stringify(meta);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const inserted: HTMLMetaElement[] = [];
    for (const tag of JSON.parse(metaKey) as MetaTag[]) {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (tag.name) el.setAttribute("name", tag.name);
        if (tag.property) el.setAttribute("property", tag.property);
        document.head.appendChild(el);
        inserted.push(el);
      }
      el.setAttribute("content", tag.content);
    }

    return () => {
      document.title = prevTitle;
      for (const el of inserted) el.remove();
    };
  }, [title, metaKey]);
}
