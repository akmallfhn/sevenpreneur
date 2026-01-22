import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sevenpreneur | The 1st AI-Integrated Business Training Program",
    description:
      "All-in-one business learning platform untuk founder dan entrepreneur. Dapatkan roadmap, modul praktis, dan strategi eksekusi agar bisnismu bisa level up.",
    short_name: "Sevenpreneur",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
