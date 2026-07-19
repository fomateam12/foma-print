import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The fluid type ramp in globals.css (`.text-display`, `.text-h1` …) shares
// the `text-` prefix with Tailwind's color utilities. Without this config
// tailwind-merge classifies them as text-color classes and silently drops
// them when a real color like `text-foreground` follows in the same cn()
// call — which is how every SectionHeader title collapsed to 16px.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-lead",
        "text-caption",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
