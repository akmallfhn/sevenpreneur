export function extractEmbedPathFromYouTubeURL(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1) + parsedUrl.search;
    }
    return null;
  } catch {
    return null;
  }
}
