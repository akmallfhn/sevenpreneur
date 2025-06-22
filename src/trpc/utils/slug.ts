export function createSlugFromTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
}
