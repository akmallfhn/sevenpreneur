"use client";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { useTheme } from "next-themes";

interface AppEmojiPickerProps {
  isOpen: boolean;
  onEmojiClick: (emojiData: EmojiClickData) => void;
}

export default function AppEmojiPicker(props: AppEmojiPickerProps) {
  const { resolvedTheme } = useTheme();
  const pickerTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT;

  return (
    <div>
      <EmojiPicker
        open={props.isOpen}
        onEmojiClick={props.onEmojiClick}
        height={400}
        emojiStyle={EmojiStyle.NATIVE}
        theme={pickerTheme}
        searchDisabled
      />
    </div>
  );
}
