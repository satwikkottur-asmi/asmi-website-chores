import { useEffect } from "react";

type MetaTag = { name?: string; property?: string; content: string };

export function useDocumentMeta(title: string, meta: MetaTag[] = []) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const inserted: HTMLMetaElement[] = [];
    for (const tag of meta) {
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
  }, [title, meta]);
}
