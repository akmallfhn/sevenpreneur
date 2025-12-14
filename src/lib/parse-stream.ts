"use client";
import { useRef } from "react";
import { AIChatEventType } from "./app-types";

export interface AIChatChunk {
  event: AIChatEventType;
  data: string;
}

interface parseResult {
  events: AIChatChunk[];
  newBuffer: string;
}

interface AIStreamPayload {
  model: string;
  token: string;
  conv_id?: string;
  message: string;
}

// Converting raw streaming text (chunk-by-chunk)
export function parseEventStream(text: string, buffer: string): parseResult {
  let newBuffer = buffer + text;

  const eventChunks = newBuffer.split("\n\n");
  newBuffer = eventChunks.pop() || "";

  const events: AIChatChunk[] = [];
  for (const chunk of eventChunks) {
    if (chunk.trim() === "") continue;

    const event: AIChatChunk = {
      event: "error",
      data: "(empty data)",
    };

    const lines = chunk.trim().split("\n");

    for (const line of lines) {
      if (line.startsWith(":")) continue;

      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;

      const field = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trimStart();

      if (field === "event") {
        event.event = value as AIChatEventType;
      } else if (field === "data") {
        event.data = JSON.parse(value) as string;
      }
    }

    if (event.data) {
      events.push(event);
    }
  }

  return { events, newBuffer };
}

// Streams AI events from the server to the React UI in real time
export function useStreamAIChat() {
  const bufferRef = useRef("");

  async function sendMessage(
    payload: AIStreamPayload,
    handlers: {
      onEvent?: (event: AIChatChunk) => void;
      onCompleted?: () => void;
      onError?: (err: Error) => void;
    }
  ) {
    // Fetch to API Route
    try {
      const response = await fetch("/api/stream/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error("HTTP error status: " + response.status);
      }

      // Read Stream & Decode Binary
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Parse chunk to event
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const { events, newBuffer } = parseEventStream(
          chunk,
          bufferRef.current
        );

        bufferRef.current = newBuffer;

        for (const event of events) {
          handlers.onEvent?.(event);
        }
      }
      handlers.onCompleted?.();
    } catch (error) {
      handlers.onError?.(error as Error);
    }
  }

  return { sendMessage };
}
