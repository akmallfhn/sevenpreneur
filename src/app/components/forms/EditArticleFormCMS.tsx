"use client";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ArticleStatus } from "@/lib/app-types";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ChevronRight,
  ListMinus,
  Loader2,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import InputCMS from "../fields/InputCMS";
import SelectCMS from "../fields/SelectCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import TextAreaRichEditorCMS from "../fields/TextAreaRichEditorCMS";
import TextAreaTitleCMS from "../fields/TextAreaTitleCMS";
import UploadImageCMS from "../fields/UploadImageCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";

export interface BodyContentArticle {
  id?: number;
  index_order: number | string;
  sub_heading: string | null;
  image_path: string | null;
  image_desc: string | null;
  content: string | null;
}

interface EditArticleFormProps {
  sessionToken: string;
  articleId: number;
}

export default function EditArticleForm(props: EditArticleFormProps) {
  const updateArticle = trpc.update.article.useMutation();
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
  const {
    data: articleDetails,
    isLoading: isLoadingInitial,
    isError: isErrorInitial,
  } = trpc.read.article.useQuery(
    { id: props.articleId },
    { enabled: !!props.sessionToken },
  );
  const initialData = articleDetails?.article;

  const isLoading = isLoadingCategories || isLoadingUsers || isLoadingInitial;
  const isError = isErrorCategories || isErrorUsers || isErrorInitial;

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
    articleTitle: initialData?.title || "",
    articleInsight: initialData?.insight || "",
    articleImage: initialData?.image_url || "",
    articleStatus: initialData?.status as ArticleStatus,
    articleCategoryId: initialData?.category.id || "",
    articleKeyword: initialData?.keywords || "",
    articleAuthorId: initialData?.author.id || "",
    articleReviewerId: initialData?.reviewer.id || "",
    articlePublishDate: initialData?.published_at
      ? dayjs(initialData.published_at).format("YYYY-MM-DDTHH:mm")
      : "",
    articleBodyContent:
      initialData?.body_content.map((post: BodyContentArticle) => ({
        id: Date.now() + Math.random(),
        index_order: post.index_order,
        sub_heading: post.sub_heading,
        image_path: null,
        image_desc: null,
        content: post.content,
      })) || [],
  });

  // Keep updated data
  useEffect(() => {
    if (initialData) {
      setFormData({
        articleTitle: initialData.title || "",
        articleInsight: initialData.insight || "",
        articleImage: initialData.image_url || "",
        articleStatus: initialData.status as ArticleStatus,
        articleCategoryId: initialData.category.id || "",
        articleKeyword: initialData.keywords || "",
        articleAuthorId: initialData.author.id || "",
        articleReviewerId: initialData.reviewer.id || "",
        articlePublishDate: initialData.published_at
          ? dayjs(initialData.published_at).format("YYYY-MM-DDTHH:mm")
          : "",
        articleBodyContent: initialData.body_content.map(
          (post: BodyContentArticle) => ({
            id: Date.now() + Math.random(),
            index_order: post.index_order,
            sub_heading: post.sub_heading,
            image_path: null,
            image_desc: null,
            content: post.content,
          }),
        ),
      });
    }
  }, [initialData]);

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

  // Add remove body-content
  const handleAddBodyContent = () => {
    if (formData.articleBodyContent.length >= 7) return;
    setFormData((prev) => ({
      ...prev,
      articleBodyContent: [
        ...prev.articleBodyContent,
        {
          id: Date.now() + Math.random(),
          index_order: prev.articleBodyContent.length + 1,
          sub_heading: "",
          image_path: null,
          image_desc: null,
          content: "",
        },
      ],
    }));
  };
  const handleDeleteBodyContent = (id: number) => {
    setFormData((prev) => {
      if (formData.articleBodyContent.length <= 1) return prev;
      const updated = prev.articleBodyContent
        .filter((item) => item.id !== id)
        .map((item, i) => ({
          ...item,
          index_order: i + 1,
        }));
      return {
        ...prev,
        articleBodyContent: updated,
      };
    });
  };
  const handleChangeBodyContent =
    (id: number, field: keyof BodyContentArticle) => (value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        articleBodyContent: prev.articleBodyContent.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
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

    const invalidBodyContent = formData.articleBodyContent.some(
      (item, index) => {
        if (index === 0) {
          return !item.content?.trim();
        }
        return !item.sub_heading?.trim() || !item.content?.trim();
      },
    );

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
    if (formData.articleBodyContent.length === 0 || invalidBodyContent) {
      toast.error("Subheading or body content cannot be empty");
      if (status === "DRAFT") {
        setIsSubmittingDraft(false);
      } else {
        setIsSubmittingPublished(false);
      }
      return;
    }

    // POST to Database
    try {
      updateArticle.mutate(
        {
          // Mandatory fields:
          id: props.articleId,
          title: formData.articleTitle.trim(),
          insight: formData.articleInsight.trim(),
          image_url: formData.articleImage,
          body_content: formData.articleBodyContent.map(
            (item: BodyContentArticle, index) => ({
              index_order: Number(item.index_order),
              sub_heading:
                index === 0 ? null : item.sub_heading?.trim() || null,
              image_path: null,
              image_desc: null,
              content: item.content,
            }),
          ),
          published_at: new Date(formData.articlePublishDate).toISOString(),
          category_id: Number(formData.articleCategoryId),
          author_id: formData.articleAuthorId,
          reviewer_id: formData.articleReviewerId,
          keywords: formData.articleKeyword.trim(),
          status,
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
            <AppBreadcrumbItem isCurrentPage>Edit</AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage="Edit SEO Article"
              descPage="Improve search performance by updating keywords, metadata, and on-page structure"
            />
            <div className="page-actions flex items-center gap-4">
              {initialData?.status === "DRAFT" && (
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
              )}
              <AppButton
                onClick={(e) => handleSubmit(e, "PUBLISHED")}
                variant="cmsPrimary"
                type="submit"
                disabled={isSubmittingPublished}
              >
                {isSubmittingPublished ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <Save className="size-5" />
                )}
                Save Changes
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
              <div className="body-content flex flex-col gap-4 bg-white rounded-md">
                {formData.articleBodyContent.map((post, index) => (
                  <div
                    className="flex flex-col p-4 gap-4 bg-section-background/50 rounded-md border border-outline"
                    key={post.id}
                  >
                    {index !== 0 && (
                      <InputCMS
                        inputId="publish-date"
                        inputName="Sub-Heading"
                        inputPlaceholder="Write section sub-title…"
                        inputType="text"
                        value={post.sub_heading || ""}
                        onInputChange={handleChangeBodyContent(
                          post.id!,
                          "sub_heading",
                        )}
                        required
                      />
                    )}
                    <TextAreaRichEditorCMS
                      textAreaId="body-content"
                      textAreaName="Body Content"
                      value={post.content || ""}
                      onTextAreaChange={handleChangeBodyContent(
                        post.id!,
                        "content",
                      )}
                      required
                    />
                    {formData.articleBodyContent.length > 1 && (
                      <AppButton
                        className="w-fit"
                        type="button"
                        variant="destructive"
                        size="medium"
                        onClick={() => handleDeleteBodyContent(post.id!)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </AppButton>
                    )}
                  </div>
                ))}
                {formData.articleBodyContent.length < 7 && (
                  <AppButton
                    variant="cmsPrimary"
                    size="medium"
                    onClick={handleAddBodyContent}
                    type="button"
                  >
                    <PlusCircle className="size-4" />
                    Add Paragraph
                  </AppButton>
                )}
              </div>
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
                  <TextAreaCMS
                    textAreaId="insight"
                    textAreaName="Content Summary"
                    textAreaPlaceholder="Write a 3-sentence summary that captures the article’s main topic and overall takeaway"
                    textAreaHeight="h-44"
                    value={formData.articleInsight}
                    onTextAreaChange={handleInputChange("articleInsight")}
                    required
                  />
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
