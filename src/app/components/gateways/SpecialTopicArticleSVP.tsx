"use client";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { ArticleList } from "../indexes/ArticleListSVP";

interface SpecialTopicArticleSVPProps {
  topicName: string;
  topicImage: string;
  articleList: ArticleList[];
}

export default function SpecialTopicArticleSVP(
  props: SpecialTopicArticleSVPProps,
) {
  return (
    <div className="special-topic relative flex w-full aspect-[2/3] rounded-lg overflow-hidden sm:aspect-[4/1.2]">
      <div className="special-topic-image absolute flex w-full aspect-video top-0 z-10 sm:top-auto sm:left-0 sm:w-fit sm:h-full">
        <Image
          className="flex object-cover w-full h-full"
          src={props.topicImage}
          alt={props.topicName}
          width={1000}
          height={1000}
        />
      </div>
      <div className="overlay-blur absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md bg-gradient-to-t from-white/60 to-transparent z-20 sm:inset-y-0 sm:right-0 sm:left-auto sm:top-auto sm:w-1/2 sm:h-full sm:bg-gradient-to-l" />
      <div className="special-topic-articles absolute flex flex-col inset-x-5 h-[348px] bottom-5 p-4 gap-4 bg-white rounded-md z-30 dark:bg-surface-black xs:h-[512px] sm:absolute sm:w-1/2 sm:h-4/5 sm:m-0 sm:mt-0 sm:top-1/2 sm:-translate-y-1/2 sm:right-7 sm:inset-x-auto sm:bottom-auto">
        <h2 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
          {props.topicName}
        </h2>
        <div className="flex flex-col gap-4 overflow-y-auto">
          {props.articleList.map((post, index) => (
            <Link
              href={`/insights/${post.slug_url}/${post.id}`}
              key={index}
              className={`article-item flex gap-5 items-center transition transform duration-150 active:scale-95 active:bg-[#F2f2f2] dark:active:bg-surface-black`}
            >
              <div className="image-container flex w-[80px] aspect-square shrink-0 overflow-hidden rounded-lg lg:w-24">
                <Image
                  className="flex w-full h-full object-cover object-right-top scale-[140%] origin-top-right"
                  src={post.image_url}
                  alt={post.title}
                  width={160}
                  height={160}
                />
              </div>
              <div className="attributes flex flex-col font-bodycopy w-full lg:pr-4">
                <p className="title font-bold text-base font-content line-clamp-2 leading-snug sm:hover:underline sm:hover:underline-offset-3">
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
      <div className="special-topic-background absolute flex inset-0">
        <Image
          className="flex object-cover w-full h-full"
          src={props.topicImage}
          alt={props.topicName}
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
}
