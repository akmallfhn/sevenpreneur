"use client";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

interface AppEmojiPickerProps {
  isOpen: boolean;
  onEmojiClick: (emojiData: EmojiClickData) => void;
}

export default function AppEmojiPicker(props: AppEmojiPickerProps) {
  return (
    <div>
      <EmojiPicker
        open={props.isOpen}
        onEmojiClick={props.onEmojiClick}
        height={400}
        emojiStyle={EmojiStyle.NATIVE}
        searchDisabled
      />
    </div>
  );
}
