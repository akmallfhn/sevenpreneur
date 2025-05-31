export default function manifest() {
    return {
      name: "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
      short_name: "Sevenpreneur",
      description: "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: '#fff',
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
    }
  }