"use client";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { useClipboard } from "@/lib/use-clipboard";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ChevronRight,
  Copy,
  ExternalLink,
  FilePenLine,
  Loader2,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";

interface ArticleListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function ArticleListCMS(props: ArticleListCMSProps) {
  const allowedRolesCreateArticle = [0, 4];
  const { copy } = useClipboard();

  // Set Session Token to Header
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  // Fetch tRPC List Article
  const { data, isLoading, isError } = trpc.list.articles.useQuery(
    {},
    { enabled: !!props.sessionToken },
  );
  const articleList = data?.list;

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <React.Fragment>
      <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
        <div className="web-marketing-tools max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>SEO Articles</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage="SEO Articles"
                descPage=" SEO content management hub to create, optimize, and drive organic traffic."
              />
              {allowedRolesCreateArticle.includes(props.sessionUserRole) && (
                <AppButton variant="cmsPrimary">
                  <PlusCircle className="size-5" />
                  Create Article
                </AppButton>
              )}
            </div>
          </div>

          {/* Loading & Error State */}
          {isLoading && (
            <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isError && (
            <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
              No Data
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && (
            <table className="relative w-full rounded-sm">
              <thead className="bg-[#FAFAFA] text-alternative/70">
                <tr>
                  <TableHeadCMS>{`Image`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Metadata`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Person`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                </tr>
              </thead>
              <tbody>
                {articleList?.map((post) => (
                  <tr
                    className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                    key={post.id}
                  >
                    <TableCellCMS>
                      <div className="flex flex-col items-center max-w-44 gap-2">
                        <div className="image flex aspect-video rounded-sm overflow-hidden">
                          <Image
                            className="w-full h-full object-cover"
                            src={post.image_url}
                            alt={post.title}
                            width={300}
                            height={300}
                          />
                        </div>
                        <AppButton
                          variant="outline"
                          size="small"
                          onClick={() => {
                            copy(
                              `https://www.${domain}/insights/${post.slug_url}/${post.id}`,
                            );
                            toast.success("Link copied!");
                          }}
                        >
                          <Copy className="size-4" />
                          Copy Link
                        </AppButton>
                      </div>
                    </TableCellCMS>
                    <TableCellCMS>
                      <div className="metadata flex flex-col max-w-72 gap-1.5 xl:max-w-96 2xl:max-w-[502px]">
                        <h2 className="article-title font-bold font-bodycopy text-[15px] line-clamp-2 leading-snug">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div
                            className={`article-categories flex rounded-full items-center text-xs py-[2px] px-[10px] text-white font-bodycopy font-medium`}
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, rgb(37, 98, 231) 0%, rgb(110, 0, 255) 100%)",
                            }}
                          >
                            {post.category.name}
                          </div>
                          <div
                            className={`article-id flex rounded-full items-center text-xs py-[2px] px-[10px] text-[#333333] border border-[#D8D8D8] font-bodycopy font-medium`}
                            style={{
                              backgroundImage: "#FAFAFA",
                            }}
                          >
                            {post.id}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="article-keywords font-bodycopy font-[440] text-[#686868] text-sm line-clamp-1">
                            Keywords: {post.keywords}
                          </p>
                          <p className="article-keywords font-bodycopy font-[440] text-[#686868] text-sm line-clamp-1">
                            Published at{" "}
                            {dayjs(post.published_at).format(
                              "dddd, D MMM YYYY - HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                    </TableCellCMS>
                    <TableCellCMS>
                      <div className="author flex flex-col gap-3">
                        <div className="author flex flex-col gap-1">
                          <p className="text-sm font-bodycopy font-semibold">
                            Author:
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex size-5 rounded-full overflow-hidden">
                              <Image
                                src={
                                  post.author.avatar ||
                                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                                }
                                alt={post.author.full_name}
                                className="aspect-video object-cover"
                                width={300}
                                height={300}
                              />
                            </div>
                            <p className="text-sm font-bodycopy font-medium line-clamp-1">
                              {post.author.full_name}
                            </p>
                          </div>
                        </div>
                        <div className="reviewer flex flex-col gap-1">
                          <p className="text-sm font-bodycopy font-semibold">
                            Reviewer:
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex size-5 rounded-full overflow-hidden">
                              <Image
                                src={
                                  post.reviewer.avatar ||
                                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                                }
                                alt={post.reviewer.full_name}
                                className="aspect-video object-cover"
                                width={300}
                                height={300}
                              />
                            </div>
                            <p className="text-sm font-bodycopy font-medium line-clamp-1">
                              {post.reviewer.full_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCellCMS>
                    <TableCellCMS>
                      <div className="flex flex-col gap-2">
                        <Link href={`/articles/${post.id}/edit`}>
                          <AppButton variant="cmsPrimary" size="small">
                            <FilePenLine className="size-4" />
                            Edit
                          </AppButton>
                        </Link>
                        <Link
                          href={`https://www.${domain}/insights/${post.slug_url}/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <AppButton variant="cmsPrimaryLight" size="small">
                            <ExternalLink className="size-4" />
                            Preview
                          </AppButton>
                        </Link>
                      </div>
                    </TableCellCMS>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
