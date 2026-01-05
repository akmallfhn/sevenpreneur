"use client";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { FilePenLine } from "lucide-react";

interface ArticleItemCMSProps {
  articleId: number;
  articleTitle: string;
  articleImage: string;
  articleDescription: string;
}

export default function ArticleItemCMS(props: ArticleItemCMSProps) {
  return (
    <div className="article-item flex gap-7 items-start">
      {/* PREVIEW */}
      <div className="flex flex-col items-center w-44 gap-2">
        <div className="flex aspect-video rounded-sm overflow-hidden">
          <Image
            className="w-full h-full object-cover"
            src={props.articleImage}
            alt={props.articleTitle}
            width={300}
            height={300}
          />
        </div>
        {/* {!dayjs(post.published_at).isAfter(timeNow) &&
          post.status === "published" && (
            <Link
              href={post.full_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={"secondary"} size="sm">
                Link Preview
                <ExternalLink />
              </Button>
            </Link>
          )} */}
      </div>
      {/* METADATA */}
      <div className="flex flex-col w-[469px] gap-2">
        <h2 className="title font-bold font-bodycopy line-clamp-2">
          {props.articleTitle}
        </h2>
        {/* <div className="label-group flex gap-2">
          <LabelAttribute labelName={post.channel_name} />
          <LabelAttribute
            labelName={
              post.content_type.charAt(0).toUpperCase() +
              post.content_type.slice(1)
            }
            variants="secondary"
          />
          <LabelAttribute
            labelName={
              post.content_model.charAt(0).toUpperCase() +
              post.content_model.slice(1)
            }
            variants="secondary"
          />
          <LabelAttribute labelName={`#${post.id}`} variants="secondary" />
        </div> */}
        <p className="description font-bodycopy text-main-black/50 text-sm line-clamp-2">
          {props.articleDescription}
        </p>
        {/* <LabelTag labelTagData={post.tag_names.split(",")} /> */}
      </div>
      {/* AUTHOR & PUBLISHED */}
      {/* <div className="flex flex-col gap-2 w-[140px]"> */}
      {/* <div className="flex flex-col gap-1">
          <BasicLabel labelName={"Editor:"} />
          <BasicUserList
            userProfile={post.editor_names.split(",")}
            userAvatar={post.editor_avatars.split(",")}
          />
        </div> */}
      {/* <div className="flex flex-col gap-1">
          <BasicLabel labelName={"Reporter:"} />
          {post.reporter_names ? (
            <BasicUserList
              userProfile={post.reporter_names.split(",")}
              userAvatar={post.reporter_avatars.split(",")}
            />
          ) : (
            <p>-</p>
          )}
        </div> */}
      {/* <div className="flex flex-col gap-1">
          <BasicLabel labelName={"Published at:"} />
          <p className="text-sm font-bodycopy text-main-black/50">
            {dayjs(post.published_at)
              .locale("id")
              .tz("Asia/Jakarta")
              .format("lll")}
          </p>
        </div> */}
      {/* </div> */}

      <div className="action flex flex-col gap-2 w-[128px]">
        {/* Status & Edit Status */}
        <div className="flex flex-col gap-1">
          {/* <BasicLabel labelName={"Status:"} /> */}
          {/* <div className="flex gap-2 items-center">
            {post.status !== "draft" && (
              <Switch
                checked={post.status === "published"}
                onCheckedChange={() => setSelectedArticle(post)}
                disabled={isStatusChanged === post.id}
              />
            )}
            {isStatusChanged === post.id ? (
              <Loader2 className="animate-spin text-main-black/20 size-4" />
            ) : (
              <p className="status text-sm font-bodycopy">
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </p>
            )}
          </div> */}
        </div>
        <Link href={`/articles/edit/`}>
          <AppButton variant="cmsPrimary" size="medium">
            <FilePenLine className="size-4" />
            Edit
          </AppButton>
        </Link>
        {/* {!dayjs(post.published_at).isAfter(timeNow) &&
          post.status === "published" && (
            <Button
              variant="secondary_default"
              size="sm"
              className="w-fit"
              onClick={() => handleCopyLink(post.full_url)}
            >
              <Copy />
              Copy Link
            </Button>
          )}
        {!dayjs(post.published_at).isAfter(timeNow) &&
          post.status === "published" && (
            <Button
              variant="secondary_default"
              size="sm"
              className="w-fit"
              disabled={isRequestIndexing === post.full_url}
              onClick={() =>
                bypassGoogleIndexing(post.full_url, post.published_at)
              }
            >
              {isRequestIndexing === post.full_url ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Earth />
              )}
              Bypass Google
            </Button>
          )} */}
      </div>
    </div>
  );
}
