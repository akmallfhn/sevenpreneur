"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import AppSocialMediaButton from "../buttons/AppSocialMediaButton";
import styles from "./Article.module.css";
import { useEffect, useState } from "react";
import ArticleDetailsMobileSVP from "./ArticleDetailsMobileSVP";

dayjs.extend(duration);

export interface ArticleBodyContent {
  index_order: number;
  sub_heading: string | null;
  image_path: string | null;
  image_desc: string | null;
  content: string | null;
}

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

export default function ArticleDetailsSVP(props: ArticleDetailsSVP) {
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

  const insight = props.articleInsight.split(". ");

  if (isMobile) {
    return (
      <ArticleDetailsMobileSVP
        articleId={props.articleId}
        articleTitle={props.articleTitle}
        articleImage={props.articleImage}
        articleCategory={props.articleCategory}
        articleDate={props.articleDate}
        articleInsight={props.articleInsight}
        articleSlug={props.articleSlug}
        articleBody={props.articleBody}
        articleReadingTime={props.articleReadingTime}
        articleAuthorName={props.articleAuthorName}
        articleAuthorAvatar={props.articleAuthorAvatar}
      />
    );
  }

  return (
    <div className="page-root relative flex flex-col items-center w-full bg-white dark:bg-coal-black">
      <div className="page-container flex w-full justify-between gap-10 py-5 px-24 max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <main className="main flex flex-[2.5] flex-col pb-20 gap-6 shrink-0">
          <div className="title-category flex flex-col gap-3">
            <p className="w-fit py-1 px-4 font-bodycopy font-medium bg-[#EFEDF9] text-[#42359B] text-base dark:bg-[#1A1534] dark:text-[#958FB7] rounded-md">
              {props.articleCategory}
            </p>
            <h1 className="title font-bodycopy font-extrabold leading-snug text-3xl">
              {props.articleTitle}
            </h1>
          </div>
          <div className="author-date flex items-center py-3 gap-3 border-y border-outline dark:border-outline-dark">
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
            <p className="date-publish font-bodycopy font-medium text-[#333333] text-base dark:text-[#BCBCBC]">
              {dayjs(props.articleDate).format("D MMMM YYYY")} ·{" "}
              {Math.round(props.articleReadingTime)} mins read
            </p>
          </div>
          <div className="article-image relative gap-2 flex flex-col aspect-video rounded-md overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={props.articleImage}
              alt={props.articleTitle}
              width={800}
              height={800}
            />
          </div>
          <div className="insight flex flex-col w-full p-6 bg-linear-to-bl from-0% from-[#D2E5FC] to-50% to-section-background gap-4 rounded-lg border border-primary-light dark:border-outline-dark dark:from-[#0F0641] dark:to-surface-black">
            <h3 className="w-fit font-bodycopy font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
              Ringkasan Artikel
            </h3>
            <ul className="flex flex-col gap-1 list-disc list-outside pl-4">
              {insight.map((post) => (
                <li
                  key={post}
                  className="font-read text-[#333333] text-lg dark:text-[#BCBCBC]"
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
                <h2 className="font-bodycopy font-bold text-2xl pt-1 pb-1">
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
                    __html: DOMPurify.sanitize(post.content),
                  }}
                />
              )}
            </section>
          ))}
        </main>
        <aside className="desktop-aside relative flex flex-1 flex-col w-full">
          <div className="content-aside sticky top-[84px] w-full flex flex-col gap-5 pb-20">
            <div className="table-of-contents flex flex-col w-full p-4 bg-linear-to-bl from-0% from-[#D2E5FC] to-50% to-section-background gap-2 rounded-lg border border-primary-light dark:border-outline-dark dark:from-[#0F0641] dark:to-surface-black">
              <h3 className="w-fit font-bodycopy font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-40% from-primary to-120% to-secondary">
                Table of Contents
              </h3>
              <p className="title font-read text-[#333333] text-base dark:text-[#BCBCBC]">
                {props.articleTitle}
              </p>
              <div className="chapter relative flex flex-col gap-1">
                {props.articleBody
                  .filter((post) => !!post.sub_heading)
                  .map((post) => (
                    <Link
                      href={`#page-${post.index_order}`}
                      key={post.index_order}
                      className="flex items-center gap-5 z-10"
                    >
                      <div className="step-point bg-primary size-2 rounded-full shrink-0 outline-primary-light/60 outline-3 dark:bg-secondary dark:outline-white/10" />
                      <p className="font-read text-[#333333] text-base p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 dark:text-[#BCBCBC]">
                        {post.sub_heading}
                      </p>
                    </Link>
                  ))}
                <div
                  className="step-rail absolute left-0.5 w-[1px] h-full self-stretch"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, #B8C9DD 0, #B8C9DD 6px, transparent 6px, transparent 12px)",
                  }}
                />
              </div>
            </div>
            <div className="share-social-media flex items-center gap-4">
              <p className="font-semibold font-bodycopy text-[#333333] text-[15px] dark:text-[#BCBCBC]">
                Share
              </p>
              <div className="flex items-center gap-2">
                <AppSocialMediaButton
                  link={`https://wa.me/?text=${props.articleTitle}.%20Read%20more%20on%20https://www.sevenpreneur.com/insights/${props.articleSlug}/${props.articleId}`}
                  variant="whatsapp"
                />
                <AppSocialMediaButton
                  link={`https://twitter.com/intent/tweet?text=${props.articleTitle}.%20Read%20more%20on&url=https://www.sevenpreneur.com/insights/${props.articleSlug}/${props.articleId}`}
                  variant="x"
                />
                <AppSocialMediaButton
                  link={`https://www.linkedin.com/shareArticle?mini=true&url=https://www.sevenpreneur.com/insights/${props.articleSlug}/${props.articleId}`}
                  variant="linkedin"
                />
                <AppSocialMediaButton
                  link={`https://www.facebook.com/sharer/sharer.php?u=https://www.sevenpreneur.com/insights/${props.articleSlug}/${props.articleId}`}
                  variant="facebook"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
