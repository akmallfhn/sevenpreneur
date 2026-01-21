import { marked } from "marked";

export function markdownToHtml(markdown: string) {
  return marked.parse(markdown);
}

// export async function parsedMarkdownToHtml(markdown: string): Promise<string> {
//   const html = await marked.parse(markdown);
//   return DOMPurify.sanitize(html);
// }

// export function useMarkdown(markdown: string) {
//   const [html, setHtml] = useState("");

//   useEffect(() => {
//     parsedMarkdownToHtml(markdown).then(setHtml);
//   }, [markdown]);

//   return html;
// }
