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
