import type { MetadataRoute } from "next";

/** Lets the app be installed on a phone's home screen, opening full-screen like a native app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IELTS Coach · with Yuvraj",
    short_name: "Yuvraj",
    description: "IELTS General Training practice for CLB 9, with your coach Yuvraj.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
