import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useState } from "react";

export async function markdownToHtml(markdown: string): Promise<string> {
  const html = await marked.parse(markdown);
  return DOMPurify.sanitize(html);
}

export function useMarkdown(markdown: string) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    markdownToHtml(markdown).then(setHtml);
  }, [markdown]);

  return html;
}
