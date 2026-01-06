"use client";
import { useMarkdown } from "@/lib/markdown-to-html";
import { useClipboard } from "@/lib/use-clipboard";
import { Check, CopyIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import styles from "./Markdown.module.css";

interface ChatResponseMarkdownProps {
  chatMessage: string;
  isGeneratingMessage: boolean;
}

export default function ChatResponseMarkdown(props: ChatResponseMarkdownProps) {
  const { copied, copy } = useClipboard();

  return (
    <div className="chat-response-box flex flex-1 w-full py-5 gap-3">
      <div className="chat-response-avatar size-[30px] shrink-0 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square.svg"
          }
          alt="Sevenpreneur AI"
          width={100}
          height={100}
        />
      </div>
      <div className="chat-response-message flex flex-col w-full gap-2">
        <div
          className={`${styles.markdown} w-full`}
          dangerouslySetInnerHTML={{
            __html: useMarkdown(props.chatMessage),
          }}
        />
        {props.isGeneratingMessage ? (
          <Loader2 className="animate-spin text-alternative size-6" />
        ) : (
          <AppButton
            variant="ghost"
            size="icon"
            onClick={() => copy(props.chatMessage)}
          >
            {copied ? (
              <Check className="text-green-400 size-5" />
            ) : (
              <CopyIcon className="text-alternative size-5" />
            )}
          </AppButton>
        )}
      </div>
    </div>
  );
}
