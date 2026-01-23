"use client";
import { ArticleStatus } from "@/lib/app-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArticleListMobileSVP from "./ArticleListMobileSVP";

dayjs.extend(relativeTime);

export interface ArticleList {
  id: number;
  title: string;
  image_url: string;
  slug_url: string;
  published_at: string;
  status: ArticleStatus;
  category: {
    name: string;
  };
  author: {
    full_name: string;
    avatar: string | null;
  };
}

interface ArticleListSVPProps {
  articleList: ArticleList[];
}

export default function ArticleListSVP(props: ArticleListSVPProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const activeArticles = props.articleList.filter(
    (item) => item.status === "PUBLISHED",
  );

  if (isMobile) {
    return <ArticleListMobileSVP articleList={activeArticles} />;
  }

  return (
    <div className="page-root relative hidden flex-col items-center w-full bg-white dark:bg-coal-black lg:flex">
      <div className="page-container flex flex-col px-5 py-5 w-full gap-10 z-10 lg:px-0 lg:py-10 lg:pb-20 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="headline-articles grid grid-cols-[1.6fr_1fr] gap-5 bg-linear-to-bl from-0% from-[#D2E5FC] to-30% to-section-background rounded-xl overflow-hidden border border-primary-light dark:border-0 dark:from-[#0F0641] dark:to-surface-black">
          <Link
            className="main-article flex h-full shrink-0"
            href={`/insights/${activeArticles[0].slug_url}/${activeArticles[0].id}`}
          >
            <div className="relative flex w-full h-full overflow-hidden">
              <Image
                className="article-image w-full object-cover object-left xl:object-center"
                src={activeArticles[0].image_url}
                alt={activeArticles[0].title}
                width={800}
                height={800}
              />
            </div>
          </Link>
          <div className="aside-articles flex flex-col flex-1 w-full gap-4 py-4">
            <h2 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
              Headline News
            </h2>
            <div className="article-list flex flex-col gap-5">
              {activeArticles.slice(1, 4).map((post, index) => (
                <Link
                  href={`/insights/${post.slug_url}/${post.id}`}
                  key={index}
                  className={`article-item flex gap-5 items-center transition transform duration-150 active:scale-95 active:bg-[#F2f2f2]`}
                >
                  <div className="image-container flex max-w-[180px] aspect-video shrink-0 overflow-hidden rounded-lg">
                    <Image
                      className="flex w-full h-full object-cover"
                      src={post.image_url}
                      alt={post.title}
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="attributes flex flex-col font-bodycopy w-full pr-4">
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
        <div className="flex flex-col p-6 gap-4 bg-section-background/50 border border-outline rounded-xl overflow-hidden dark:bg-surface-black dark:border-0">
          <h2 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
            Trending News
          </h2>
          <div className="grid grid-cols-4 w-full gap-5">
            {activeArticles.slice(4, 12).map((post) => (
              <Link
                className="article-item w-full flex flex-col gap-2"
                href={`/insights/${post.slug_url}/${post.id}`}
                key={post.id}
              >
                <div className="article-image w-full aspect-video rounded-md overflow-hidden group">
                  <Image
                    className="object-cover w-full h-full transition transform duration-500 ease-in-out group-hover:scale-110"
                    src={post.image_url}
                    alt={post.title}
                    width={400}
                    height={400}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="article-title font-bodycopy font-bold text-base line-clamp-2 leading-snug transition transform hover:underline hover:underline-offset-3">
                    {post.title}
                  </p>
                  <p className="article-category font-bodycopy text-sm text-primary">
                    {post.category.name}{" "}
                    <span className="text-[#333333] dark:text-word-black">
                      · {dayjs(post.published_at).fromNow()}
                    </span>
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
