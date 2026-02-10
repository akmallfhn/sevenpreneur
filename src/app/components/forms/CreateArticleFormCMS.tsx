"use client";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ArticleStatus } from "@/lib/app-types";
import { setSessionToken, trpc } from "@/trpc/client";
import { ChevronRight, ListMinus, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import InputCMS from "../fields/InputCMS";
import SelectCMS from "../fields/SelectCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import TextAreaTitleCMS from "../fields/TextAreaTitleCMS";
import UploadImageCMS from "../fields/UploadImageCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import TextAreaRichEditorCMS from "../fields/TextAreaRichEditorCMS";

export interface BodyContentArticle {
  index_order: number | string;
  sub_heading: string | null;
  image_path: string | null;
  image_desc: string | null;
  content: string | null;
}

interface CreateArticleFormProps {
  sessionToken: string;
}

export default function CreateArticleForm(props: CreateArticleFormProps) {
  const createArticle = trpc.create.article.useMutation();
  const router = useRouter();
  const utils = trpc.useUtils();

  // Set session token to client
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  // Return data from tRPC
  const {
    data: articleCategoryList,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = trpc.list.articleCategories.useQuery(undefined, {
    enabled: !!props.sessionToken,
  });
  const {
    data: userList,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = trpc.list.users.useQuery(
    { role_id: 0 },
    { enabled: !!props.sessionToken },
  );

  const isLoading = isLoadingCategories || isLoadingUsers;
  const isError = isErrorCategories || isErrorUsers;

  // Beginning State
  const [isSubmittingPublished, setIsSubmittingPublished] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [formData, setFormData] = useState<{
    articleTitle: string;
    articleInsight: string;
    articleImage: string;
    articleStatus: ArticleStatus | null;
    articleCategoryId: string | number;
    articleKeyword: string;
    articleAuthorId: string;
    articleReviewerId: string;
    articlePublishDate: string;
    articleBodyContent: BodyContentArticle[];
  }>({
    articleTitle: "",
    articleInsight: "",
    articleImage: "",
    articleStatus: null,
    articleCategoryId: "",
    articleKeyword: "",
    articleAuthorId: "",
    articleReviewerId: "",
    articlePublishDate: "",
    articleBodyContent: [
      {
        index_order: "",
        sub_heading: null,
        image_path: null,
        image_desc: null,
        content: null,
      },
    ],
  });

  // Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleImageForm = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      articleImage: url ?? "",
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent, status: ArticleStatus) => {
    e.preventDefault();

    if (status === "DRAFT") {
      setIsSubmittingDraft(true);
    } else {
      setIsSubmittingPublished(true);
    }

    // Required field checking
    if (!formData.articleTitle) {
      toast.error("Title is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articleInsight) {
      toast.error("Content Summary is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articlePublishDate) {
      toast.error("Publish Date is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articleCategoryId) {
      toast.error("Category is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articleAuthorId) {
      toast.error("Author is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articleReviewerId) {
      toast.error("Reviewer is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }
    if (!formData.articleKeyword) {
      toast.error("Keywords is required");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }

    // POST to Database
    try {
      createArticle.mutate(
        {
          // Mandatory fields:
          title: formData.articleTitle.trim(),
          insight: formData.articleInsight.trim(),
          image_url: formData.articleImage,
          body_content: formData.articleBodyContent.map(
            (item: BodyContentArticle) => ({
              index_order: Number(item.index_order),
              sub_heading: item.sub_heading,
              image_path: item.image_path,
              image_desc: item.image_desc,
              content: item.content,
            }),
          ),
          published_at: new Date(formData.articlePublishDate).toISOString(),
          category_id: Number(formData.articleCategoryId),
          author_id: formData.articleAuthorId,
          reviewer_id: formData.articleReviewerId,
          keywords: formData.articleKeyword.trim(),
          status: formData.articleStatus as ArticleStatus,
        },
        {
          onSuccess: () => {
            toast.success(
              status === "PUBLISHED" ? "Article is live!" : "Draft saved!",
            );
            utils.list.users.invalidate();
            router.push("/articles");
          },
          onError: (err) => {
            toast.error("Failed to create article", {
              description: err.message,
            });
          },
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
    }
  };

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <form className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/articles">Articles</AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem isCurrentPage>Create</AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage="Create SEO Article"
              descPage="Write and manage a new SEO article by optimizing keywords, metadata, and structure"
            />
            <div className="page-actions flex items-center gap-4">
              <AppButton
                onClick={(e) => handleSubmit(e, "DRAFT")}
                type="submit"
                variant="outline"
                disabled={isSubmittingDraft}
              >
                {isSubmittingDraft && (
                  <Loader2 className="animate-spin size-5" />
                )}
                Save as Draft
              </AppButton>
              <AppButton
                onClick={(e) => handleSubmit(e, "PUBLISHED")}
                variant="cmsPrimary"
                type="submit"
                disabled={isSubmittingPublished}
              >
                {isSubmittingPublished ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <Send className="size-5" />
                )}
                Publish
              </AppButton>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}

        {!isLoading && !isError && (
          <div className="editing-area flex w-full gap-6">
            <main className="main-content flex flex-2 flex-col gap-6">
              <TextAreaTitleCMS
                textAreaId="title"
                textAreaPlaceholder="Write title..."
                characterLength={255}
                value={formData.articleTitle}
                onTextAreaChange={handleInputChange("articleTitle")}
              />
              <div className="image w-full xl:w-3/5">
                <UploadImageCMS
                  fileValue={formData.articleImage}
                  onUpload={handleImageForm}
                  folderPath="articles"
                  fileBytes={1024 * 624}
                  fileSize="500 KB"
                  imageRatio="16/9"
                />
              </div>
              <TextAreaCMS
                textAreaId="insight"
                textAreaName="Content Summary"
                textAreaPlaceholder="Write a 3-sentence summary that captures the article’s main topic and overall takeaway"
                textAreaHeight="h-32"
                value={formData.articleInsight}
                onTextAreaChange={handleInputChange("articleInsight")}
                required
              />
              <TextAreaRichEditorCMS
                value={formData.articleKeyword}
                onTextAreaChange={handleInputChange("articleKeyword")}
              />
            </main>
            <aside className="aside-content flex flex-1 flex-col gap-5">
              <div className="flex flex-col w-full gap-4 border border-outline rounded-lg">
                <div className="section-title flex gap-3 px-6 py-3 items-center bg-black text-white rounded-t-lg">
                  <ListMinus />
                  <h2 className="font-bodycopy font-semibold text-sm">
                    Metadata Settings
                  </h2>
                </div>
                <div className="flex flex-col gap-5 p-4 pt-0">
                  <InputCMS
                    inputId="publish-date"
                    inputName="Publish Date"
                    inputType="datetime-local"
                    value={formData.articlePublishDate}
                    onInputChange={handleInputChange("articlePublishDate")}
                    required
                  />
                  <SelectCMS
                    selectId="category"
                    selectName="Category"
                    selectPlaceholder="Choose topic category"
                    value={formData.articleCategoryId}
                    onChange={handleInputChange("articleCategoryId")}
                    options={
                      articleCategoryList?.list.map((item) => ({
                        label: item.name,
                        value: item.id,
                      })) || []
                    }
                    required
                  />
                  <SelectCMS
                    selectId="author"
                    selectName="Author"
                    selectPlaceholder="Select Author"
                    value={formData.articleAuthorId}
                    onChange={handleInputChange("articleAuthorId")}
                    options={
                      userList?.list.map((item) => ({
                        label: item.full_name,
                        value: item.id,
                        image: item.avatar || "",
                      })) || []
                    }
                    required
                  />
                  <SelectCMS
                    selectId="reviewer"
                    selectName="Reviewer"
                    selectPlaceholder="Select Reviewer"
                    value={formData.articleReviewerId}
                    onChange={handleInputChange("articleReviewerId")}
                    options={
                      userList?.list.map((item) => ({
                        label: item.full_name,
                        value: item.id,
                        image: item.avatar || "",
                      })) || []
                    }
                    required
                  />
                  <TextAreaCMS
                    textAreaId="keywords"
                    textAreaName="Keywords"
                    textAreaPlaceholder="e.g. Bisnis 2 Milyar, Kerugian Perusahaan, etc"
                    textAreaHeight="h-20"
                    value={formData.articleKeyword}
                    onTextAreaChange={handleInputChange("articleKeyword")}
                    required
                  />
                </div>
              </div>
            </aside>
          </div>
        )}
      </form>
    </div>
  );
}
