"use client";
import dayjs from "dayjs";
import { Share2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import styles from "./Article.module.css";
import { ArticleBodyContent } from "./ArticleDetailsSVP";

interface ArticleDetailsSVP {
  articleId: number;
  articleTitle: string;
  articleImage: string;
  articleCategory: string;
  articleDate: string;
  articleSlug: string;
  articleBody: ArticleBodyContent[];
  articleReadingTime: number;
  articleAuthorName: string;
  articleAuthorAvatar: string;
  articleInsight: string;
}

export default function ArticleDetailsMobileSVP(props: ArticleDetailsSVP) {
  const insight = props.articleInsight.split(". ");

  // Open navigator share
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!navigator.share) {
      toast.error("Sharing is not supported on this device or browser.");
      return;
    }

    try {
      await navigator.share({
        title: props.articleTitle,
        text: props.articleInsight,
        url: `https://www.sevenpreneur.com/insights/${props.articleSlug}/${props.articleId}`,
      });
    } catch (error) {
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            toast.error("Sharing permission was denied.");
            break;

          case "SecurityError":
            toast.error("Sharing is blocked due to security restrictions.");
            break;

          default:
            toast.error("Failed to share the article. Please try again.");
        }
      } else {
        toast.error("Unexpected error occurred while sharing.");
        console.error("Share error:", error);
      }
    }
  };

  return (
    <div className="page-root relative flex flex-col items-center w-full bg-white dark:bg-coal-black">
      <main className="page-container flex flex-col w-full pb-20 gap-6">
        <div className="title-section flex flex-col px-5 pt-5 gap-4">
          <div className="title-category flex flex-col gap-3">
            <p className="w-fit py-1 px-4 font-bodycopy font-medium bg-[#EFEDF9] text-[#42359B] text-base dark:bg-[#1A1534] dark:text-[#958FB7] rounded-md">
              {props.articleCategory}
            </p>
            <h1 className="title font-bodycopy font-extrabold leading-snug text-2xl">
              {props.articleTitle}
            </h1>
          </div>
          <p className="date-publish font-bodycopy font-medium text-[#333333] text-base dark:text-[#BCBCBC]">
            {dayjs(props.articleDate).format("D MMMM YYYY")} ·{" "}
            {Math.round(props.articleReadingTime)} mins read
          </p>
          <div className="flex items-center justify-between">
            <div className="author flex items-center gap-3">
              <div className="author-avatar w-10 aspect-square rounded-full overflow-hidden">
                <Image
                  className="w-full h-full object-cover"
                  src={props.articleAuthorAvatar}
                  alt={props.articleAuthorName}
                  width={300}
                  height={300}
                />
              </div>
              <p className="author-name font-bodycopy font-medium text-[#333333] text-base dark:text-[#BCBCBC]">
                {props.articleAuthorName}
              </p>
            </div>
            <AppButton
              className="share-button shrink-0"
              variant="outline"
              size="largeIconRounded"
              onClick={handleShare}
            >
              <Share2 className="size-5" />
            </AppButton>
          </div>
        </div>
        <div className="article-image relative gap-2 flex flex-col aspect-video">
          <Image
            className="w-full h-full object-cover"
            src={props.articleImage}
            alt={props.articleTitle}
            width={800}
            height={800}
          />
        </div>
        <div className="body-section flex flex-col px-5 gap-4">
          <div className="insight flex flex-col w-full p-4 bg-linear-to-bl from-0% from-[#D2E5FC] to-50% to-section-background gap-4 rounded-lg border border-primary-light dark:border-outline-dark dark:from-[#0F0641] dark:to-surface-black">
            <h3 className="w-fit font-bodycopy font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
              Ringkasan Artikel
            </h3>
            <ul className="flex flex-col gap-1 list-disc list-outside pl-4">
              {insight.map((post) => (
                <li
                  key={post}
                  className="font-read text-[#333333] text-base dark:text-[#BCBCBC]"
                >
                  {post}
                </li>
              ))}
            </ul>
          </div>
          {props.articleBody.map((post) => (
            <section
              id={`page-${post.index_order}`}
              className="body-content flex flex-col gap-2 scroll-mt-24"
              key={post.index_order}
            >
              {post.sub_heading && (
                <h2 className="font-bodycopy font-bold text-xl pt-1 pb-1">
                  {post.sub_heading}
                </h2>
              )}
              {post.image_path && post.image_desc && (
                <div className="flex flex-col py-2 gap-2">
                  <Image
                    className="flex object-cover rounded-lg"
                    src={post.image_path}
                    alt={post.image_desc}
                    width={1200}
                    height={1200}
                  />
                  <span className="image-description flex font-ui text-sm text-neutral-black/50">
                    {post.image_desc}
                  </span>
                </div>
              )}
              {post.content && (
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
