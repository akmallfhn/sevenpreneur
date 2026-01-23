"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import SwiperArticlesSVP from "../elements/SwiperArticlesSVP";
import { ArticleList } from "./ArticleListSVP";

dayjs.extend(relativeTime);

interface ArticleListMobileSVPProps {
  articleList: ArticleList[];
}

export default function ArticleListMobileSVP(props: ArticleListMobileSVPProps) {
  return (
    <div className="page-root relative flex flex-col items-center w-full bg-white dark:bg-coal-black lg:hidden">
      <div className="page-container flex flex-col w-full gap-5 z-10">
        <SwiperArticlesSVP articleList={props.articleList.slice(0, 4)} />
        <div className="trending-news flex flex-col gap-4 px-5 pb-20">
          <h2 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
            Trending News
          </h2>
          <div className="article-list flex flex-col gap-5">
            {props.articleList.slice(5).map((post) => (
              <Link
                href={`/insights/${post.slug_url}/${post.id}`}
                key={post.id}
                className={`article-item flex gap-5 items-center transition transform duration-150 active:scale-95 active:bg-[#F2f2f2]`}
              >
                <div className="image-container flex max-w-[168px] aspect-video shrink-0 overflow-hidden rounded-lg">
                  <Image
                    className="flex w-full h-full object-cover"
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
                  <p className="title font-bold text-base font-content line-clamp-2 leading-snug lg:hover:underline lg:hover:underline-offset-3">
                    {post.title}
                  </p>
                  <p className="timestamp font-bodycopy text-[#333333] text-sm dark:text-word-black">
                    {dayjs(post.published_at).fromNow()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
