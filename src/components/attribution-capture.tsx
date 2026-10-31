"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records first-touch attribution once per visitor — see `lib/attribution`. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
