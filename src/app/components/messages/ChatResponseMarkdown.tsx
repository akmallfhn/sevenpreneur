"use client";
import { markdownToHtml } from "@/lib/markdown-to-html";
import styles from "./Markdown.module.css";

interface ChatResponseMarkdownProps {
  chatMessage: string;
}

export default function ChatResponseMarkdown({
  chatMessage,
}: ChatResponseMarkdownProps) {
  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{
        __html: markdownToHtml(chatMessage),
      }}
    />
  );
}
