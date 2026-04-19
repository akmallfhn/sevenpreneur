"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import SwiperArticlesSVP from "../elements/SwiperArticlesSVP";
import { ArticleList } from "./ArticleListSVP";
import SpecialTopicArticleSVP from "../gateways/SpecialTopicArticleSVP";
import PageContainerSVP from "../pages/PageContainerSVP";

dayjs.extend(relativeTime);

interface ArticleListMobileSVPProps {
  articleList: ArticleList[];
  aiTechCategory: ArticleList[];
  economyCategory: ArticleList[];
}

export default function ArticleListMobileSVP(props: ArticleListMobileSVPProps) {
  return (
    <div className="page-root relative flex flex-col items-center w-full bg-background z-10 lg:hidden">
      <SwiperArticlesSVP articleList={props.articleList.slice(0, 4)} />
      <PageContainerSVP className="flex lg:hidden">
        <div className="flex flex-col w-full gap-6 py-5 pb-20">
          <div className="headline-news flex flex-col gap-4">
            <h2 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
              Headline News
            </h2>
            <div className="article-list flex flex-col gap-5">
              {props.articleList.slice(4, 12).map((post) => (
                <Link
                  href={`/insights/${post.slug_url}/${post.id}`}
                  key={post.id}
                  className="article-item flex gap-5 items-center transition transform duration-150 active:scale-95"
                >
                  <div className="image-container flex w-[80px] aspect-square shrink-0 overflow-hidden rounded-lg">
                    <Image
                      className="flex w-full h-full object-cover object-right-top scale-[140%] origin-top-right"
                      src={post.image_url}
                      alt={post.title}
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="attributes flex flex-col font-bodycopy w-full">
                    <p className="category text-sm font-semibold text-primary">
                      {post.category.name}
                    </p>
                    <p className="title font-bold text-base font-content line-clamp-2 leading-snug lg:hover:underline lg:hover:underline-offset-3 dark:text-sevenpreneur-white">
                      {post.title}
                    </p>
                    <p className="timestamp font-bodycopy text-sm text-emphasis dark:text-foreground">
                      {dayjs(post.published_at).fromNow()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <SpecialTopicArticleSVP
            topicName="AI & Technology"
            topicImage="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/poster-sc.webp"
            articleList={props.aiTechCategory}
          />
          <div className="article-list flex flex-col gap-5">
            {props.articleList.slice(12, 20).map((post) => (
              <Link
                href={`/insights/${post.slug_url}/${post.id}`}
                key={post.id}
                className={`article-item flex gap-5 items-center transition transform duration-150 active:scale-95 active:bg-[#F2f2f2] dark:active:bg-surface-black`}
              >
                <div className="image-container flex w-[80px] aspect-square shrink-0 overflow-hidden rounded-lg">
                  <Image
                    className="flex w-full h-full object-cover object-right-top scale-[140%] origin-top-right"
                    src={post.image_url}
                    alt={post.title}
                    width={160}
                    height={160}
                  />
                </div>
                <div className="attributes flex flex-col font-bodycopy w-full">
                  <p className="category text-sm font-semibold text-primary">
                    {post.category.name}
                  </p>
                  <p className="title font-bold text-base font-content line-clamp-2 leading-snug lg:hover:underline lg:hover:underline-offset-3 dark:text-sevenpreneur-white">
                    {post.title}
                  </p>
                  <p className="timestamp font-bodycopy text-sm text-emphasis dark:text-foreground">
                    {dayjs(post.published_at).fromNow()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <SpecialTopicArticleSVP
            topicName="Economy"
            topicImage="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/poster-sc-makro%20(1).webp"
            articleList={props.economyCategory}
          />
        </div>
      </PageContainerSVP>
    </div>
  );
}
