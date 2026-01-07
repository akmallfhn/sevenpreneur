import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { publicProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { AStatusEnum } from "@prisma/client";
import {
  ArticleBodyContent,
  estimateReadingTime,
  getTableOfContents,
} from "./util.article";

export const readArticle = {
  article: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    let articleStatus = AStatusEnum.PUBLISHED as Optional<AStatusEnum>;

    if (
      opts.ctx.user &&
      ["Administrator", "Marketer"].includes(opts.ctx.user.role.name)
    ) {
      articleStatus = undefined;
    }

    const theArticle = await opts.ctx.prisma.article.findFirst({
      select: {
        id: true,
        title: true,
        insight: true,
        image_url: true,
        body_content: true,
        status: true,
        category: { select: { id: true, name: true, slug: true } },
        keywords: true,
        author: { select: { full_name: true, avatar: true } },
        reviewer: { select: { full_name: true, avatar: true } },
        slug_url: true,
        published_at: true,
        updated_at: true,
      },
      where: {
        id: opts.input.id,
        status: articleStatus,
      },
    });

    if (!theArticle) {
      throw readFailedNotFound("article");
    }

    const bodyContent = theArticle.body_content as ArticleBodyContent;

    const allContentStr = bodyContent
      .map((entry) => (entry.image_desc ?? "") + " " + (entry.content ?? ""))
      .reduce((prev, cur) => prev + " " + cur, "");
    const readingTime = estimateReadingTime(allContentStr);

    const toc = getTableOfContents(theArticle.title, bodyContent);

    return {
      code: STATUS_OK,
      message: "Success",
      article: {
        ...theArticle,
        body_content: bodyContent,
        reading_time: readingTime,
        table_of_contents: toc,
      },
    };
  }),
};
