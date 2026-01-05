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
