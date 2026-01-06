"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import styles from "./Article.module.css";
import AppSocialMediaButton from "../buttons/AppSocialMediaButton";

dayjs.extend(duration);

interface ArticleBodyContent {
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
  articleDate: string;
  articleSlug: string;
  articleBody: ArticleBodyContent[];
}

export default function ArticleDetailsSVP(props: ArticleDetailsSVP) {
  return (
    <div className="page-root relative flex flex-col items-center w-full bg-white dark:bg-coal-black">
      <div className="page-container flex w-full justify-between gap-6 py-3.5 max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <aside className="desktop-aside sticky flex flex-1 flex-col w-full gap-3">
          <div className="flex items-center gap-4">
            <p className="font-semibold font-bodycopy text-[#474747] text-[15px] dark:text-[#BCBCBC]">
              Share
            </p>
            <div className="flex items-center gap-2">
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="whatsapp"
              />
              <AppSocialMediaButton link="https://instagram.com" variant="x" />
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="linkedin"
              />
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="facebook"
              />
            </div>
          </div>
        </aside>
        <main className="main flex flex-3 flex-col pb-20 gap-4">
          <div className="main-content-top flex flex-col px-4 gap-[10px] lg:px-0">
            <h1 className="title font-bodycopy font-extrabold leading-snug text-3xl">
              {props.articleTitle}
            </h1>
            <p className="date-publish font-bodycopy font-medium text-[#474747] text-base dark:text-[#BCBCBC]">
              Dipublikasi {dayjs(props.articleDate).format("D MMMM YYYY")} · 5
              mins read
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
            <div className="overlay absolute bottom-0 w-full bg-" />
          </div>

          {props.articleBody.map((post) => (
            <section
              id={`index-${post.index_order}`}
              className="body-content flex flex-col gap-2"
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
        <aside className="desktop-aside sticky flex flex-1 flex-col w-full gap-3">
          <div className="flex items-center gap-4">
            <p className="font-semibold font-bodycopy text-[#474747] text-[15px] dark:text-[#BCBCBC]">
              Share
            </p>
            <div className="flex items-center gap-2">
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="whatsapp"
              />
              <AppSocialMediaButton link="https://instagram.com" variant="x" />
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="linkedin"
              />
              <AppSocialMediaButton
                link="https://instagram.com"
                variant="facebook"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
