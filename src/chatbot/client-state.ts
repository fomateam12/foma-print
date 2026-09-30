import type { ChatAction } from "./model";
import { MAX_CONVERSATION } from "./request";

export interface UiMessage {
  role: "user" | "assistant";
  content: string;
  action?: ChatAction | null;
}

export interface ChatState {
  messages: UiMessage[];
  status: "idle" | "sending" | "error";
  error?: "rate_limited" | "verification_failed" | "unavailable" | "network";
  sessionToken?: string;
}

export type ChatEvent =
  | { type: "send"; content: string }
  | { type: "reply"; reply: string; action: ChatAction | null; sessionToken?: string }
  | { type: "error"; error: NonNullable<ChatState["error"]> }
  | { type: "reset" };

export const initialChatState: ChatState = { messages: [], status: "idle" };

export function chatReducer(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case "send":
      if (state.status === "sending" || state.messages.length >= MAX_CONVERSATION) return state;
      return {
        ...state,
        status: "sending",
        error: undefined,
        messages: [...state.messages, { role: "user", content: event.content }],
      };
    case "reply":
      return {
        ...state,
        status: "idle",
        sessionToken: state.sessionToken ?? event.sessionToken,
        messages: [...state.messages, { role: "assistant", content: event.reply, action: event.action }],
      };
    case "error":
      if (event.error === "verification_failed") {
        return { ...initialChatState, status: "error", error: event.error };
      }
      return {
        ...state,
        status: "error",
        error: event.error,
        messages: state.messages.at(-1)?.role === "user" ? state.messages.slice(0, -1) : state.messages,
      };
    case "reset":
      return initialChatState;
  }
}
