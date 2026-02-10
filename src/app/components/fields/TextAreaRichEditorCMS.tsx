"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  MessageSquareQuote,
  Redo,
  UnderlineIcon,
  Undo,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TextAreaRichEditorCMSProps {
  value: string;
  onTextAreaChange: (value: string) => void;
}

export default function TextAreaRichEditorCMS(
  props: TextAreaRichEditorCMSProps,
) {
  const [, setRefresh] = useState<number>(0);

  // Configure Editorial
  const editor = useEditor({
    // Styling Text Area
    editorProps: {
      attributes: {
        class: `font-bodycopy font-medium text-sm h-52 overflow-y-auto focus:outline-none`,
      },
    },

    // Config Extension
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Placeholder.configure({
        placeholder: "Write something...",
        emptyEditorClass: "is-empty",
      }),
      Heading.configure({
        levels: [2],
        HTMLAttributes: {
          class: "text-xl font-bold mt-2 mb-1",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-8",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-8",
        },
      }),
      Link.configure({
        openOnClick: true,
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "leading-relaxed mb-1",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class:
            "border-l-4 border-l-black/30 pl-3 my-2 italic text-lg font-quotes",
        },
      }),
      Text,
      Underline,
    ],

    // Parsed value
    content: props.value || "",

    // Prevent the editor from rendering immediately on first mount
    immediatelyRender: true,

    // Parse the HTML string into a DOM structure
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      doc
        .querySelectorAll("[class]")
        .forEach((el) => el.removeAttribute("class"));
      const cleanedHtml = doc.body.innerHTML;

      props.onTextAreaChange(cleanedHtml);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      setRefresh((v: number) => v + 1);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);

  // Configure Tools
  const historyActions = (editor: Editor) => [
    {
      value: "undo",
      label: "Undo",
      icon: <Undo />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      value: "redo",
      label: "Redo",
      icon: <Redo />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];
  const textActions = (editor: Editor) => [
    {
      value: "bold",
      label: "Bold",
      icon: <Bold />,
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      value: "italic",
      label: "Italic",
      icon: <Italic />,
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      value: "underline",
      label: "Underline",
      icon: <UnderlineIcon />,
      isActive: editor.isActive("underline"),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
  ];
  const paragraphActions = (editor: Editor) => [
    {
      value: "blockquote",
      label: "Quotes",
      icon: <MessageSquareQuote />,
      isActive: editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      value: "heading-2",
      label: "Heading 2",
      icon: <Heading2 />,
      isActive: editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
  ];
  const listActions = (editor: Editor) => [
    {
      value: "bullet-list",
      label: "Bullet List",
      icon: <List />,
      isActive: editor.isActive("bullet-list"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      value: "numbered-list",
      label: "Numbered List",
      icon: <ListOrdered />,
      isActive: editor.isActive("numbered-list"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="text-area-box relative w-full border border-outline rounded-md overflow-hidden">
      <div className="text-area-toolbar absolute flex top-0 inset-x-0 p-1 gap-1 w-full h-fit border-b z-10">
        <ToggleGroup type="multiple" size="sm">
          {editor &&
            historyActions(editor).map((post) => (
              <TooltipProvider key={post.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      className="hover:bg-black/5"
                      value={post.value}
                      aria-label={`Toggle ${post.label}`}
                      disabled={post.disabled}
                      onClick={post.onClick}
                    >
                      {post.icon}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bodycopy">{post.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </ToggleGroup>
        <ToggleGroup type="multiple" size="sm">
          {editor &&
            textActions(editor).map((post) => (
              <TooltipProvider key={post.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={post.value}
                      aria-label={`Toggle ${post.label}`}
                      data-state={post.isActive ? "on" : "off"}
                      onClick={post.onClick}
                    >
                      {post.icon}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bodycopy">{post.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </ToggleGroup>
        <ToggleGroup type="multiple" size="sm">
          {editor &&
            paragraphActions(editor).map((post) => (
              <TooltipProvider key={post.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={post.value}
                      aria-label={`Toggle ${post.label}`}
                      data-state={post.isActive ? "on" : "off"}
                      onClick={post.onClick}
                    >
                      {post.icon}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bodycopy">{post.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </ToggleGroup>
        <ToggleGroup type="multiple" size="sm">
          {editor &&
            listActions(editor).map((post) => (
              <TooltipProvider key={post.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={post.value}
                      aria-label={`Toggle ${post.label}`}
                      data-state={post.isActive ? "on" : "off"}
                      onClick={post.onClick}
                    >
                      {post.icon}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bodycopy">{post.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </ToggleGroup>
      </div>
      <div className="text-area-editor p-3 mt-[40px] border-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
