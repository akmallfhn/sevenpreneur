import { createSlugFromTitle } from "@/trpc/utils/slug";

export type ArticleBodyContent =
  | {
      index_order: number;
      sub_heading: string | null;
      image_path: string;
      image_desc: string;
      content: null;
    }[]
  | {
      index_order: number;
      sub_heading: string | null;
      image_path: null;
      image_desc: null;
      content: string;
    }[];

export const estimateWordCount = (htmlString: string) =>
  htmlString
    .replace(/<[^>]*>/g, " ")
    .trim()
    .match(/\s+/g)?.length ?? 0 + 1;

// The speed is in word per minute. The default is 200 wpm for Indonesian language.
export const estimateReadingTime = (htmlString: string, speed: number = 200) =>
  estimateWordCount(htmlString) / speed;

export function getTableOfContents(
  title: string,
  bodyContent: ArticleBodyContent
) {
  const toc = [{ level: 1, name: title, id: createSlugFromTitle(title) }];

  for (const entry of bodyContent) {
    if (entry.sub_heading) {
      toc.push({
        level: 2,
        name: entry.sub_heading,
        id: createSlugFromTitle(entry.sub_heading),
      });
    }

    if (entry.content) {
      const headingsMatcher =
        /<h(\d+)(?:[^>]*?(?=id="([^"]*?)"))?[^>]*?>(.*?)<\/h\1>/gi;
      const headingList = [...entry.content.matchAll(headingsMatcher)];
      for (const heading of headingList) {
        toc.push({
          level: Number(heading[1]),
          name: heading[3],
          id: heading[2] ?? createSlugFromTitle(heading[3]),
        });
      }
    }
  }

  return toc;
}
