"use client";
import PageTitleSectionCMS from "@/components/titles/PageTitleSectionCMS";
import { useClipboard } from "@/lib/use-clipboard";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ChevronRight,
  Copy,
  ExternalLink,
  FilePenLine,
  PlusCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppNumberPagination from "../navigations/AppNumberPagination";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeadCMS from "../tables/TableHeadCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";

interface ArticleListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function ArticleListCMS(props: ArticleListCMSProps) {
  const { copy } = useClipboard();
  const router = useRouter();
  const pageSize = 20;
  const searchParam = useSearchParams();
  const pageParam = searchParam.get("page");
  const currentPage = Number(pageParam) || 1;
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string | undefined>(
    ""
  );

  // Client-side Authorization
  const allowedRolesMutateArticle = [0, 4];

  // Debounce Typing for 1 second
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim() === "" ? undefined : keyword);
    }, 600);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Set Session Token to Header
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  // Fetch tRPC List Article
  const { data, isLoading, isError } = trpc.list.articles.useQuery(
    { page: currentPage, page_size: pageSize, keyword: debouncedKeyword },
    { enabled: !!props.sessionToken }
  );
  const articleList = data?.list;

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="web-marketing-tools w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>SEO Articles</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <PageTitleSectionCMS
                pageTitle="SEO Articles"
                pageDesc="SEO content management hub to create, optimize, and drive organic traffic."
              />
              {allowedRolesMutateArticle.includes(props.sessionUserRole) && (
                <Link href="/articles/create">
                  <AppButton variant="tertiary">
                    <PlusCircle className="size-5" />
                    Create Article
                  </AppButton>
                </Link>
              )}
            </div>
          </div>
          <div className="filter-search flex w-full items-center">
            <div className="max-w-96 w-full">
              <InputCMS
                inputId="search-article"
                inputType="search"
                inputIcon={<Search className="size-5" />}
                inputPlaceholder="Search articles..."
                value={keyword}
                onInputChange={(value) => {
                  setKeyword(value);
                  const params = new URLSearchParams(searchParam.toString());
                  params.set("page", "1");
                  router.push(`?${params.toString()}`);
                }}
              />
            </div>
          </div>

          {/* Loading & Error State */}
          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {!isLoading && !isError && (
            <table className="relative w-full rounded-sm">
              <TableHeaderCMS>
                <TableRowCMS>
                  <TableHeadCMS>{`Image`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Metadata`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Person`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                </TableRowCMS>
              </TableHeaderCMS>
              <TableBodyCMS>
                {articleList?.map((post) => (
                  <TableRowCMS key={post.id}>
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
                          variant="light"
                          size="small"
                          onClick={() => {
                            copy(
                              `https://www.${domain}/insights/${post.slug_url}/${post.id}`
                            );
                            toast.success("Link copied!");
                          }}
                        >
                          <Copy className="size-3" />
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
                            className={`article-id flex rounded-full items-center text-xs py-[2px] px-[10px] text-emphasis border border-[#D8D8D8] font-bodycopy font-medium`}
                            style={{
                              backgroundImage: "#FAFAFA",
                            }}
                          >
                            {post.id}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="article-keywords font-bodycopy font-[440] text-emphasis text-sm line-clamp-1">
                            Keywords: {post.keywords}
                          </p>
                          <p className="article-keywords font-bodycopy font-[440] text-emphasis text-sm line-clamp-1">
                            Published at{" "}
                            {dayjs(post.published_at).format(
                              "dddd, D MMM YYYY - HH:mm"
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
                        {allowedRolesMutateArticle.includes(
                          props.sessionUserRole
                        ) && (
                          <Link href={`/articles/${post.id}/edit`}>
                            <AppButton variant="tertiary" size="small">
                              <FilePenLine className="size-4" />
                              Edit
                            </AppButton>
                          </Link>
                        )}
                        <Link
                          href={`https://www.${domain}/insights/${post.slug_url}/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <AppButton variant="primarySoft" size="small">
                            <ExternalLink className="size-4" />
                            Preview
                          </AppButton>
                        </Link>
                      </div>
                    </TableCellCMS>
                  </TableRowCMS>
                ))}
              </TableBodyCMS>
            </table>
          )}
          {articleList?.length === 0 && (
            <p className="empty-state mt-2 font-bodycopy text-center text-emphasis">{`Looks like there are no results for "${debouncedKeyword}"`}</p>
          )}
          {!isLoading && !isError && (
            <div className="pagination flex flex-col w-full items-center gap-3">
              <AppNumberPagination
                currentPage={currentPage}
                totalPages={data?.metapaging.total_page ?? 1}
              />
              <p className="text-sm text-emphasis text-center font-bodycopy font-medium">{`Showing all ${data?.metapaging.total_data} articles`}</p>
            </div>
          )}
        </div>
      </PageContainerCMS>
    </React.Fragment>
  );
}
