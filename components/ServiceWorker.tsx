"use client";

import { useEffect } from "react";

/** Registers the service worker (production only), so the app can be installed on a phone. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
