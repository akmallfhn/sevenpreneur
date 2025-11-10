// utils/markdownToHtml.ts
export function markdownToHtml(markdown: string) {
  let html = markdown;

  // Escape HTML first to prevent injection
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (```js ... ```)
  html = html.replace(
    /```([\s\S]*?)```/gim,
    (match, code) => `<pre><code>${code.trim()}</code></pre>`
  );

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

  // Headings
  html = html.replace(/^###### (.*)$/gim, "<h6>$1</h6>");
  html = html.replace(/^##### (.*)$/gim, "<h5>$1</h5>");
  html = html.replace(/^#### (.*)$/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*)$/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gim, "<h1>$1</h1>");

  // Bold, italic, underline, strikethrough
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
  html = html.replace(/\*(.*?)\*/gim, "<i>$1</i>");
  html = html.replace(/__(.*?)__/gim, "<u>$1</u>");
  html = html.replace(/~~(.*?)~~/gim, "<s>$1</s>");

  // Blockquote
  html = html.replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>");

  // Horizontal rule
  html = html.replace(/^---$/gim, "<hr />");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, `<a href="$2">$1</a>`);

  // Line breaks
  html = html.replace(/\n+/gim, "<br />");

  // Tables
  html = html.replace(
    /^(\|.+\|)\n(\|[\s\-\:]+\|)\n((\|.*\|\n?)*)/gim,
    (
      _match: string,
      headerRow: string,
      _dividerRow: string,
      bodyRows: string
    ) => {
      const headers = headerRow
        .trim()
        .split("|")
        .filter((col: string) => col.trim().length > 0)
        .map((h: string) => `<th>${h.trim()}</th>`)
        .join("");

      const rows = bodyRows
        .trim()
        .split("\n")
        .filter((r: string) => r.trim().length > 0)
        .map((row: string) => {
          const cols = row
            .split("|")
            .filter((c: string) => c.trim().length > 0)
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cols}</tr>`;
        })
        .join("");

      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  // Ordered lists (1. item)
  html = html.replace(/^\d+\.\s+(.*)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gim, "<ol>$1</ol>");

  // Unordered lists (- item or * item)
  html = html.replace(/^\s*[-\*]\s+(.*)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>");

  // Paragraphs (anything not inside tags)
  html = html.replace(
    /^(?!<h\d|<ul|<ol|<li|<blockquote|<pre|<table|<img|<hr)(.+)$/gim,
    "<p>$1</p>"
  );

  // Clean up nested <ul> or <ol> (avoid double-wrapping)
  html = html.replace(/<\/(ul|ol)><\1>/gim, "");

  return html.trim();
}
