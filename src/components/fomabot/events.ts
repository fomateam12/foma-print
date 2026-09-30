/**
 * In-page entry points (header button, product-page card, FAQ card) open the
 * chat through a window event instead of importing the widget, so they stay
 * tiny server-rendered islands and the widget stays lazy.
 */
export const FOMABOT_OPEN_EVENT = "fomabot:open";

export interface FomaBotOpenDetail {
  /** Sent as the visitor's first message as soon as the chat can send. */
  question?: string;
}

export function openFomaBot(detail: FomaBotOpenDetail = {}) {
  window.dispatchEvent(new CustomEvent<FomaBotOpenDetail>(FOMABOT_OPEN_EVENT, { detail }));
}
