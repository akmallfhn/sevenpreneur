"use server";
import {
  AICOGSStructure_ProductCategory,
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "@/trpc/routers/ai_tool/enum.ai_tool";
import { AIModelName } from "@/trpc/routers/ai_tool/util.ai_tool";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import {
  BusinessEmployeeNumber,
  BusinessLegalEntity,
  BusinessYearlyRevenue,
  OccupationUser,
} from "./app-types";
import { STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND } from "./status_code";

// DELETE SESSION FOR LOGOUT
export async function DeleteSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  // Request Backend Delete Token Database
  setSecretKey(process.env.SECRET_KEY_PUBLIC_API!);
  const loggedOut = await trpc.auth.logout({ token: sessionData.value });

  // Delete token on Cookie
  if (loggedOut.code === "NO_CONTENT") {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com";
    }
    cookieStore.set("session_token", "", {
      domain: domain,
      path: "/",
      maxAge: 0,
    });
    return { code: loggedOut.code, message: loggedOut.message };
  }

  return { code: STATUS_INTERNAL_SERVER_ERROR, message: "Logout failed" };
}

// UPDATE USER DATA
interface UpdateUserBusinessProps {
  userDateofBirth: string;
  userOccupation: OccupationUser;
  businessName?: string;
  businessDescription?: string;
  businessAgeYears?: number;
  businessIndustry?: number;
  businessLegalEntity?: BusinessLegalEntity;
  businessEmployeeNum?: BusinessEmployeeNumber;
  businessYearlyRevenue?: BusinessYearlyRevenue;
  companyProfileUrl?: string;
  averageSellingPrice?: number;
}
export async function UpdateUserBusiness({
  userDateofBirth,
  userOccupation,
  businessName,
  businessDescription,
  businessAgeYears,
  businessIndustry,
  businessLegalEntity,
  businessEmployeeNum,
  businessYearlyRevenue,
  companyProfileUrl,
  averageSellingPrice,
}: UpdateUserBusinessProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  setSessionToken(sessionData.value);

  const updateUserBusiness = await trpc.update.user_business({
    date_of_birth: userDateofBirth,
    occupation: userOccupation,
    business_name: businessName,
    business_description: businessDescription,
    business_age_years: businessAgeYears,
    industry_id: businessIndustry,
    legal_entity_type: businessLegalEntity,
    total_employees: businessEmployeeNum,
    yearly_revenue: businessYearlyRevenue,
    company_profile_url: companyProfileUrl,
    average_selling_price: averageSellingPrice,
  });

  return {
    code: updateUserBusiness.code,
    message: updateUserBusiness.message,
  };
}

// CHECK IN SESSION
interface CheckInSessionProps {
  learningId: number;
}
export async function CheckInSession(props: CheckInSessionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  setSessionToken(sessionData.value);

  const checkInSession = await trpc.create.checkIn({
    learning_id: props.learningId,
  });

  return {
    code: checkInSession.code,
    message: checkInSession.message,
    attendance: checkInSession.attendance,
  };
}

// CHECK OUT SESSION
interface CheckOutSessionProps {
  learningId: number;
  checkOutCode: string;
}
export async function CheckOutSession(props: CheckOutSessionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  setSessionToken(sessionData.value);

  const checkOutSession = await trpc.create.checkOut({
    learning_id: props.learningId,
    check_out_code: props.checkOutCode,
  });

  return {
    code: checkOutSession.code,
    message: checkOutSession.message,
    attendance: checkOutSession.attendance,
  };
}

// MAKE PAYMENT COHORT AT XENDIT
interface MakePaymentCohortXenditProps {
  cohortPriceId: number;
  paymentChannelId: number | null;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentCohortXendit({
  cohortPriceId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentCohortXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  setSessionToken(sessionData.value);

  const paymentResponse = await trpc.purchase.cohort({
    cohort_price_id: cohortPriceId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// MAKE PAYMENT EVENT AT XENDIT
interface MakePaymentEventXenditProps {
  eventPriceId: number;
  paymentChannelId: number | null;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentEventXenditProps({
  eventPriceId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentEventXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.event({
    event_price_id: eventPriceId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// MAKE PAYMENT PLAYLIST AT XENDIT
interface MakePaymentPlaylistXenditProps {
  playlistId: number;
  paymentChannelId: number | null;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentPlaylistXendit({
  playlistId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentPlaylistXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.playlist({
    playlist_id: playlistId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// CHECK DISCOUNT PLAYLIST
interface CheckDiscountPlaylistProps {
  discountCode: string;
  playlistId: number;
}
export async function CheckDiscountPlaylist({
  discountCode,
  playlistId,
}: CheckDiscountPlaylistProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    playlist_id: playlistId,
  });
  const discountDataRaw = checkDiscount?.discount;
  const discountData = {
    ...discountDataRaw,
    calc_percent:
      typeof discountDataRaw?.calc_percent === "object" &&
      "toNumber" in discountDataRaw.calc_percent
        ? discountDataRaw.calc_percent.toNumber()
        : Number(discountDataRaw?.calc_percent ?? 0),
  };
  return {
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
  };
}

// CHECK DISCOUNT COHORT
interface CheckDiscountCohortProps {
  discountCode: string;
  cohortId: number;
}
export async function CheckDiscountCohort({
  discountCode,
  cohortId,
}: CheckDiscountCohortProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    cohort_id: cohortId,
  });
  const discountDataRaw = checkDiscount?.discount;
  const discountData = {
    ...discountDataRaw,
    calc_percent:
      typeof discountDataRaw?.calc_percent === "object" &&
      "toNumber" in discountDataRaw.calc_percent
        ? discountDataRaw.calc_percent.toNumber()
        : Number(discountDataRaw?.calc_percent ?? 0),
  };
  return {
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
  };
}

// CHECK DISCOUNT EVENT
interface CheckDiscountEventProps {
  discountCode: string;
  eventId: number;
}
export async function CheckDiscountEvent({
  discountCode,
  eventId,
}: CheckDiscountEventProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    event_id: eventId,
  });
  const discountDataRaw = checkDiscount?.discount;
  const discountData = {
    ...discountDataRaw,
    calc_percent:
      typeof discountDataRaw?.calc_percent === "object" &&
      "toNumber" in discountDataRaw.calc_percent
        ? discountDataRaw.calc_percent.toNumber()
        : Number(discountDataRaw?.calc_percent ?? 0),
  };
  return {
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
  };
}

// CANCEL PAYMENT AT XENDIT
interface CancelPaymentXenditProps {
  transactionId: string;
}
export async function CancelPaymentXendit({
  transactionId,
}: CancelPaymentXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const cancelResponse = await trpc.purchase.cancel({
    id: transactionId,
  });
  return {
    code: cancelResponse.code,
    message: cancelResponse.message,
  };
}

// CREATE SUBMISSION LMS
interface CreateSubmissionProps {
  projectId: number;
  submissionDocumentUrl: string;
}
export async function CreateSubmission({
  projectId,
  submissionDocumentUrl,
}: CreateSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const createSubmission = await trpc.create.submission({
    project_id: projectId,
    document_url: submissionDocumentUrl,
  });
  return {
    code: createSubmission.code,
    message: createSubmission.message,
  };
}

// UPDATE SUBMISSION LMS
interface EditSubmissionProps {
  submissionId: number;
  submissionDocumentUrl?: string | null;
  submissionComment?: string | null;
}
export async function EditSubmission({
  submissionId,
  submissionDocumentUrl,
  submissionComment,
}: EditSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const editSubmission = await trpc.update.submission({
    id: submissionId,
    document_url: submissionDocumentUrl,
    comment: submissionComment,
  });

  return {
    code: editSubmission.code,
    message: editSubmission.message,
  };
}

// DELETE SUBMISSION LMS
interface DeleteSubmissionProps {
  submissionId: number;
}
export async function DeleteSubmission({
  submissionId,
}: DeleteSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const deleteSubmission = await trpc.delete.submission({
    id: submissionId,
  });
  return {
    code: deleteSubmission.code,
    message: deleteSubmission.message,
  };
}

// CREATE DISCUSSION STARTER
interface CreateDiscussionStarterProps {
  learningSessionId: number;
  discussionStarterMessage: string;
}
export async function CreateDiscussionStarter({
  learningSessionId,
  discussionStarterMessage,
}: CreateDiscussionStarterProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const createDiscussionStarter = await trpc.create.discussionStarter({
    learning_id: learningSessionId,
    message: discussionStarterMessage,
  });

  const createdDiscussionStarter = {
    ...createDiscussionStarter.discussion,
    created_at: createDiscussionStarter.discussion.created_at.toISOString(),
    updated_at: createDiscussionStarter.discussion.updated_at.toISOString(),
  };

  return {
    code: createDiscussionStarter.code,
    message: createDiscussionStarter.message,
    discussion: createdDiscussionStarter,
  };
}

// CREATE DISCUSSION REPLY
interface CreateDiscussionReplyProps {
  discussionStarterId: number;
  discussionReplyMessage: string;
}
export async function CreateDiscussionReply({
  discussionStarterId,
  discussionReplyMessage,
}: CreateDiscussionReplyProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const createDiscussionReply = await trpc.create.discussionReply({
    starter_id: discussionStarterId,
    message: discussionReplyMessage,
  });

  const createdDiscussionReply = {
    ...createDiscussionReply.discussion,
    created_at: createDiscussionReply.discussion.created_at.toISOString(),
    updated_at: createDiscussionReply.discussion.updated_at.toISOString(),
  };

  return {
    code: createDiscussionReply.code,
    message: createDiscussionReply.message,
    discussion: createdDiscussionReply,
  };
}

// LIST DISCUSSION REPLIES
interface DiscussionReplyListProps {
  discussionStarterId: number;
}
export async function DiscussionReplyList({
  discussionStarterId,
}: DiscussionReplyListProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const discussionRepliesRes = await trpc.list.discussionReplies({
    starter_id: discussionStarterId,
  });

  const discussionReplies = discussionRepliesRes.list.map((item) => ({
    ...item,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  }));

  return {
    code: discussionRepliesRes.code,
    message: discussionRepliesRes.message,
    list: discussionReplies,
  };
}

// DELETE DISCUSSION STARTER
interface DeleteDiscussionStarterProps {
  discussionStarterId: number;
}
export async function DeleteDiscussionStarter({
  discussionStarterId,
}: DeleteDiscussionStarterProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const deleteDiscussionStarter = await trpc.delete.discussionStarter({
    id: discussionStarterId,
  });

  return {
    code: deleteDiscussionStarter.code,
    message: deleteDiscussionStarter.message,
  };
}

// DELETE DISCUSSION REPLY
interface DeleteDiscussionReplyProps {
  discussionReplyId: number;
}
export async function DeleteDiscussionReply({
  discussionReplyId,
}: DeleteDiscussionReplyProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const deleteDiscussionReply = await trpc.delete.discussionReply({
    id: discussionReplyId,
  });

  return {
    code: deleteDiscussionReply.code,
    message: deleteDiscussionReply.message,
  };
}

// SEND CHAT AI
interface SendAIChatProps {
  conversationId: string | undefined;
  message: string;
}
export async function SendAIChat({ conversationId, message }: SendAIChatProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const sendChat = await trpc.use.ai.sendChat({
    model: AIModelName.GPT_4_1_MINI,
    conv_id: conversationId,
    message: message,
  });

  return {
    code: sendChat.code,
    message: sendChat.message,
    conv_id: sendChat.conv_id,
    conv_name: sendChat.conv_name,
    chat_id: sendChat.chat_id,
    chat: sendChat.chat,
    chat_created_at: sendChat.chat_created_at,
    result_id: sendChat.result_id,
    result: sendChat.result,
    result_created_at: sendChat.result_created_at,
  };
}

// AI IDEA VALIDATION
interface GenerateAIIdeaValidationProps {
  problemStatement: string;
  problemContext: string;
  proposedSolution: string;
  availableResources: string;
}
export async function GenerateAIIdeaValidation(
  props: GenerateAIIdeaValidationProps
) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const generateIdeaValidator = await trpc.use.ai.ideaValidation({
    model: AIModelName.GPT_5_MINI,
    problem: props.problemStatement,
    location: props.problemContext,
    ideation: props.proposedSolution,
    resources: props.availableResources,
  });

  return {
    code: generateIdeaValidator.code,
    message: generateIdeaValidator.message,
    id: generateIdeaValidator.result_id,
  };
}

// AI MARKET SIZE
interface GenerateAIMarketSizeProps {
  productName: string;
  productDescription: string;
  productType: AIMarketSize_ProductType;
  customerType: AIMarketSize_CustomerType;
  operatingArea: string;
  salesChannel: string;
}
export async function GenerateAIMarketSize(props: GenerateAIMarketSizeProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const generateMarketSize = await trpc.use.ai.marketSize({
    model: AIModelName.GPT_5_MINI,
    product_name: props.productName,
    description: props.productDescription,
    product_type: props.productType,
    customer_type: props.customerType,
    company_operating_area: props.operatingArea,
    sales_channel: props.salesChannel,
  });

  return {
    code: generateMarketSize.code,
    message: generateMarketSize.message,
    id: generateMarketSize.result_id,
  };
}

// AI COMPETITOR GRADING
interface GenerateAICompetitorGradingProps {
  productName: string;
  productDescription: string;
  productCountry: string;
  productIndustry: string;
}
export async function GenerateAICompetitorGrading(
  props: GenerateAICompetitorGradingProps
) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const generateCompetitorGrading = await trpc.use.ai.competitorGrading({
    model: AIModelName.GPT_5_MINI,
    product_name: props.productName,
    product_description: props.productDescription,
    country: props.productCountry,
    industry: props.productIndustry,
  });

  return {
    code: generateCompetitorGrading.code,
    message: generateCompetitorGrading.message,
    id: generateCompetitorGrading.result_id,
  };
}

// AI COGS STRUCTURE
interface GenerateCOGSStructureProps {
  productName: string;
  productDescription: string;
  productCategory: AICOGSStructure_ProductCategory;
}
export async function GenerateCOGSStructure(props: GenerateCOGSStructureProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const generateCOGSStructure = await trpc.use.ai.COGSStructure({
    model: AIModelName.GPT_5_MINI,
    product_name: props.productName,
    description: props.productDescription,
    product_category: props.productCategory,
  });

  return {
    code: generateCOGSStructure.code,
    message: generateCOGSStructure.message,
    id: generateCOGSStructure.result_id,
  };
}

// AI PRICE STRATEGY
export interface CostList {
  name: string;
  quantity: number;
  unit: string;
  total_cost: number;
}
interface GenerateAIPriceStrategyProps extends GenerateCOGSStructureProps {
  productionPerMonth: number;
  variableCostList: CostList[];
  fixedCostList: CostList[];
}
export async function GenerateAIPriceStrategy(
  props: GenerateAIPriceStrategyProps
) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const generatePriceStrategy = await trpc.use.ai.pricingStrategy({
    model: AIModelName.GPT_5_MINI,
    product_name: props.productName,
    description: props.productDescription,
    product_category: props.productCategory,
    production_per_month: props.productionPerMonth,
    variable_cost_list: props.variableCostList,
    fixed_cost_list: props.fixedCostList,
  });

  return {
    code: generatePriceStrategy.code,
    message: generatePriceStrategy.message,
    id: generatePriceStrategy.result_id,
  };
}
